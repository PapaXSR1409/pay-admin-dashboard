define(
  [
    'react',
    '../../event-history/event-history',
    '../../info-approval/info-approval'
  ],
  function (React, EventHistory, InfoApproval) {
    var TimelineBody = React.createClass({
      render: function () {
        return (
          <div className="timeline-body">

            <div className="row">
              <div className="col-sm-4 border-right">
                {this.props.description}
              </div>
              <div className="col-sm-4 border-right">
                <EventHistory items={this.props.eventHistory}/>
              </div>
              <div className="col-sm-4 border-right">
                <InfoApproval
                  {...this.props.infoApproval}
                  releaseNote={this.props.releaseNote}
                  category={this.props.category}
                  onCopyClipboard={this.props.onCopyClipboard} />
              </div>
            </div>
          </div>
        )
      }
    });

    return TimelineBody
  }
)