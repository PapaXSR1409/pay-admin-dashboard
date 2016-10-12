define(
  [
    'react',
    './timeline-header',
    './timeline-body'
  ],
  function (React, TimelineHeader, TimelineBody) {
    var TimelineItem = React.createClass({
      getDefaultProps: function () {
        return {
          icon: 'fa fa-coffee',
          iconTheme: 'bg-blue',
          time: '',
        }
      },
      render: function () {
        var body = '';
        if (this.props.body) {
          body = <TimelineBody description={this.props.body.description}
                               eventHistory={this.props.body.eventHistory}
                               infoApproval={this.props.body.infoApproval}
                               category={this.props.body.category}
                               releaseNote={this.props.body.releaseNote}
                               onCopyClipboard={this.props.onCopyClipboard}>
          </TimelineBody>
        }

        return (
          <li>
            <i className={this.props.icon+" "+ this.props.iconTheme}></i>

            <div className="timeline-item">
					        <span className="time">
					        	<i className="fa fa-clock-o"></i>&nbsp;
                    {this.props.time}
					        </span>

              <TimelineHeader url={this.props.header.url} title={this.props.header.title}
                              author={this.props.header.author}/>

              {body}
            </div>
          </li>
        )
      }
    });

    return TimelineItem
  }
)