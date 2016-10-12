define(
  ['lodash'],
  function (_) {

    var getConfig = (key) => {
        return _.get(window.__config__, key);
    }

    var getGitHubToken = () => getConfig("gitHub.accessToken");

    var getProjects = () => getConfig("projects");

    var getTagCategories = () => getConfig("tagCategories");

    var getProductionCutOff = () => getConfig("productionCutOff");

    var getJenkinsDeployParamBuildUrl = () => getConfig("jenkins.deployParamBuildUrl");

    return {
      getGitHubToken,
      getProjects,
      getTagCategories,
      getProductionCutOff,
      getJenkinsDeployParamBuildUrl
    }
  }
)