define(
  [
    'react',
    'lodash',
    'moment',
    './github-data-service',
    './navigation-menu',
    './components/timeline/timeline',
    'react-toastr',

  ],
  function (React, _, moment, GithubDataService, NavigationMenu, Timeline, ReactToastr) {
    var ReleasesPipelinePage = React.createClass({
      getInitialState: function () {
        return {
          timelineInfo: [],
          readyForApproval: 0,
          readyForStaging: 0,
          readyForProduction: 0
        }
      },

      populateHeader: function (tag) {
        return {
          url: tag.pullRequest.url,
          title: `#${tag.version} ${tag.project.label} `,
          author: tag.pullRequest.userName,
          avatar:tag.pullRequest.userAvatar,
        }
      },

      populateEventHistory: function (tag) {
        var items = [
          {
            label: 'Merged',
            date: moment(tag.commit.date).format('DD/MM/YYYY HH:MM')
          }
        ];

        if (tag.approval) {
          items.push({
            label: 'Approved by ' + tag.approval.tag.author,
            date: moment(tag.approval.tag.date).format('DD/MM/YYYY HH:MM')
          })
        }

        return items;
      },

      populateInfoApproval: function (tag) {
        var approved = false;
        var approver = '';

        if (tag.approval) {
          approved = true;
          approver = tag.approval.tag.author;
        }

        return {
          approved: approved,
          approver: approver,
          projectName: tag.project.name,
          tag: `${tag.name}-${tag.version}`
        }
      },

      populateItem: function (tag) {
        var split = tag.pullRequest.body.split(new RegExp('## RELEASE NOTE'));
        var releaseNote = '';

        if (split.length > 1) {
          releaseNote = _.trim(split[1]);
        }

        return {
          icon: 'fa fa-cube',
          iconTheme: 'bg-blue',
          time: moment(tag.tag.date).fromNow(),
          header: this.populateHeader(tag),
          body: {
            category: tag.category,
            description: tag.commit.message,
            releaseNote: releaseNote,
            eventHistory: this.populateEventHistory(tag),
            infoApproval: this.populateInfoApproval(tag)
          }
        };
      },

      countReadyForApproval: function (tags) {
        return _.filter(tags.integrationTags, tag => typeof(tag.approval) === 'undefined').length;
      },

      countReadyForStaging: function (tags) {
        return _.filter(tags.integrationTags, tag => typeof(tag.approval) !== 'undefined').length;
      },

      countReadyForProduction: function (tags) {
        return tags.stagingTags.length;
      },

      loadFromServer: function (notify) {

        GithubDataService.fetchAllTags()
          .then(tags => {
            var integrationItems = tags.integrationTags.map(integrationTag=> {
              return this.populateItem(integrationTag);
            });

            var stagingItems = tags.stagingTags.map(stagingTag=> {
              return this.populateItem(stagingTag);
            });

            var productionItems = tags.productionTags.map(productionTag=> {
              return this.populateItem(productionTag);
            });

            var timelineInfo = [
              {
                name: 'TEST ENVIRONMENT',
                items: integrationItems
              },
              {
                name: 'STAGING ENVIRONMENT',
                items: stagingItems
              },
              {
                name: 'PRODUCTION ENVIRONMENT',
                items: productionItems
              }
            ];

            this.setState({
              timelineInfo: timelineInfo,
              readyForApproval: this.countReadyForApproval(tags),
              readyForStaging: this.countReadyForStaging(tags),
              readyForProduction: this.countReadyForProduction(tags)
            });

            if (true) {
              this.refs.alerts.clear();

              if (this.state.readyForApproval > 0) {
                this.addReadyForApprovalAlert();
              }

              if (this.state.readyForStaging > 0) {
                this.addReadyForStagingAlert();
              }

              if (this.state.readyForProduction > 0) {
                this.addReadyForProductionAlert();
              }
            }
          }
        );
      },

      componentDidMount: function () {
        this.loadFromServer();
      },

      addReadyForApprovalAlert: function () {
        this.refs.alerts.warning(
          <span><span className="number">{this.state.readyForApproval}</span> ready for <strong>APPROVAL</strong></span>,
          <em></em>, {
            timeOut: 5000,
          });
      },

      addReadyForStagingAlert: function () {
        this.refs.alerts.warning(
          <span><span className="number">{this.state.readyForStaging}</span> ready for <strong>STAGING</strong></span>,
          <em></em>, {
            timeOut: 5000,
          });
      },

      addReadyForProductionAlert: function () {
        this.refs.alerts.warning(
          <span><span className="number">{this.state.readyForProduction}</span> ready for <strong>PROD</strong></span>,
          <em></em>, {
            timeOut: 5000,
          });
      },

      addCopyToClipboardInfo: function (cmd) {
        this.refs.alerts.info(
          <span>Copied to clipboard</span>,
          <em></em>, {
            timeOut: 5000,
          });
      },


      render: function () {
        var {ToastContainer} = ReactToastr;
        var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

        return (
          <div className="wrapper">

            <NavigationMenu onCountDown={ () => this.loadFromServer(true) } />

            <ToastContainer ref="alerts"
                            toastMessageFactory={ToastMessageFactory}
                            className="toast-top-right"/>

            <div className="content-wrapper">
              <section className="content">
                <div className="row">
                  <Timeline timelineInfo={this.state.timelineInfo}
                            onCopyClipboard={ this.addCopyToClipboardInfo}/>
                </div>
              </section>

            </div>

            <footer className="main-footer">
              <div className="pull-right hidden-xs">
                <b>Version</b> 1.0.0
              </div>
              <strong>GOV.UK Pay</strong>
            </footer>
          </div>
        )
      }
    });

    return ReleasesPipelinePage;
  }
)