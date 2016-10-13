define(
  [
    'lodash',
    'octokat',
    './config'
  ],
  function (_, Octokat, Config) {

    var getApiFor = (projectName) => {
      return new Octokat({token: Config.getGitHubToken()})
        .repos('alphagov', projectName);
    };

    var fetchAllPages = (promise) => {
      return new Promise(resolve => {
        var accumulator = [];

        function fetch(promise) {
          promise.then(data => {
            data.map(d => accumulator.push(d));
            if (data.nextPage) {
              fetch(data.nextPage());
            } else {
              resolve(accumulator);
            }
          });
        }

        fetch(promise);
      });
    };

    var fetchProjectTags = () => {
      return Promise.all(Config.getProjects().map(project => {
        return fetchAllPages(getApiFor(project.name).git.refs('tag').fetch())
          .then(tags => _.map(tags, tag => _.extend({}, tag, {project: project})));
      })).then(tagsPerProject => _.flatten(tagsPerProject));
    };

    var fetchAllTags = () => {
      return new Promise(resolve => {

        fetchProjectTags()
          .then(tags => {

            var normaliseTag = (tag, category, name) => {
              var match = tag.ref.match(new RegExp('^refs/tags/' + name + '-(.*)$'));
              if (match) {
                return {
                  'project': tag.project,
                  'category': category,
                  'name': name,
                  'version': match[1],
                  'tag': {
                    'sha': tag.object.sha
                  }
                }
              }
            };

            var normaliseTags = (tag) => {
              for (let p of _.toPairs(Config.getTagCategories())) {
                var match = normaliseTag(tag, p[0], p[1]);
                if (match) return match;
              }
            };

            var relevantTags = (tag) => {
              return (tag !== undefined);
            };

            var normalisedTagsGroupedByName =
              _.chain(tags)
                .map(normaliseTags)
                .filter(relevantTags)
                .groupBy('name')
                .value();

            var allIntegrationTags = normalisedTagsGroupedByName[Config.getTagCategories().integration];
            var allStagingTags = normalisedTagsGroupedByName[Config.getTagCategories().staging];
            var allProductionTags = normalisedTagsGroupedByName[Config.getTagCategories().production];
            var allIntegrationApprovedTags = normalisedTagsGroupedByName[Config.getTagCategories().integrationApproved];

            var maxVersionPerProjectFor = (allTags) => {
              var result = {}

              _.chain(allTags).groupBy('project.name').forIn((value, key) => {
                result[key] = _.chain(value).map(v => v.version).max().value();
              }).value();

              return result;
            };

            var currentStagingVersionPerProject = maxVersionPerProjectFor(allStagingTags);
            var currentProductionVersionPerProject = maxVersionPerProjectFor(allProductionTags);

            var notInStaging = (tag) => {
              return parseInt(tag.version) > parseInt(currentStagingVersionPerProject[tag.project.name]);
            };

            var notInProduction = (tag) => {
              return parseInt(tag.version) > parseInt(currentProductionVersionPerProject[tag.project.name]);
            };

            var integrationTags = _.filter(allIntegrationTags, notInStaging);
            var stagingTags = _.filter(allStagingTags, notInProduction);

            var sortByVersionAsc = tag => parseInt(tag.version);

            var productionTags = _.chain(allProductionTags)
              .sortBy([sortByVersionAsc])
              .slice(-Config.getProductionCutOff())
              .value();

            var inIntegrationOrStagingOrProduction = (tag) => {
              var match = (productionTag) =>
              (productionTag.project.name === tag.project.name) &&
              (productionTag.version === tag.version);

              return _.some(integrationTags, productionTag => match(productionTag)) ||
                _.some(stagingTags, productionTag => match(productionTag)) ||
                _.some(productionTags, productionTag => match(productionTag));
            };

            var integrationApprovedTags = _.filter(allIntegrationApprovedTags, inIntegrationOrStagingOrProduction);

            var extendWithTagDetails = tag => {
              return getApiFor(tag.project.name).git(`tags/${tag.tag.sha}`).fetch().then(tagData => {
                return _.extend({}, tag, {
                  tag: {
                    author: tagData.tagger.name,
                    date: new Date(tagData.tagger.date)
                  },
                  commit: {
                    sha: tagData.object.sha
                  }
                });
              })
            };

            var extendWithCommitDetails = tag => {
              return getApiFor(tag.project.name).git.commits(tag.commit.sha).fetch().then(commitData => {
                return _.extend({}, tag, {
                  commit: {
                    sha: tag.commit.sha,
                    author: commitData.author.name,
                    date: new Date(commitData.committer.date),
                    message: commitData.message
                  }
                });
              })
            };

            var extendWithPullRequestDetails = tag => {
              var match = tag.commit.message.match(new RegExp('^Merge pull request \#(.*) from'));

              return getApiFor(tag.project.name).pulls(match[1]).fetch().then(pullRequestData => {
                return _.extend({}, tag, {
                  pullRequest: {
                    userName: pullRequestData.user.login,
                    userAvatar: pullRequestData.user.avatarUrl,
                    url: pullRequestData.htmlUrl,
                    body: pullRequestData.body
                  }
                });
              })
            };

            var extendFurtherWithTagAndCommitAndPullRequestDetails = tags => {
              return Promise.all(tags.map(tag => {
                  return extendWithTagDetails(tag)
                    .then(tag => extendWithCommitDetails(tag))
                    .then(tag => extendWithPullRequestDetails(tag));
                })
              )
            };

            var sortByDateDesc = (a, b) => b.tag.date - a.tag.date;

            Promise.all([
                extendFurtherWithTagAndCommitAndPullRequestDetails(integrationTags),
                extendFurtherWithTagAndCommitAndPullRequestDetails(stagingTags),
                extendFurtherWithTagAndCommitAndPullRequestDetails(productionTags),
                extendFurtherWithTagAndCommitAndPullRequestDetails(integrationApprovedTags)]
            ).then(allExtendedTags => {

                var extendFurtherWithApprovedTags = tags => {
                  return _.map(tags, tag => {
                    var integrationApproved =
                      _.find(allExtendedTags[3], extendedTag =>
                      (extendedTag.project.name === tag.project.name) &&
                      (extendedTag.version === tag.version));
                    return _.extend({}, tag, {
                      approval: integrationApproved
                    });
                  });
                };

                var response = {
                  integrationTags: extendFurtherWithApprovedTags(allExtendedTags[0]),
                  stagingTags: extendFurtherWithApprovedTags(allExtendedTags[1]),
                  productionTags: extendFurtherWithApprovedTags(allExtendedTags[2])
                };

                response.productionTags = _.slice(response.productionTags, -Config.getProductionCutOff());

                response.integrationTags.sort(sortByDateDesc);
                response.stagingTags.sort(sortByDateDesc);
                response.productionTags.sort(sortByDateDesc);

                resolve(response);
              });
          }
        );
      })
    };

    return {
      fetchAllTags
    }
  }
)