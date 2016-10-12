define(
  [
    'react',
    './time-label',
    './timeline-item/timeline-item'
  ],
  function (React, TimeLabel, TimelineItem) {
    var Timeline = React.createClass({
      render: function () {
        var self = this;
        var timelineInfo = [];

        this.props.timelineInfo.map(function (timelineElement, iterator) {
          if (timelineElement.name) {
            timelineInfo.push(<TimeLabel key={"label2"+iterator} theme="bg-green"
                                         content={timelineElement.name}/>)
          }

          timelineElement.items.map(function (item, i) {
            timelineInfo.push(
              <TimelineItem
                key={"item"+iterator+i}
                icon={item.icon}
                iconTheme={item.iconTheme}
                time={item.time}
                header={item.header}
                body={item.body}
                onCopyClipboard={self.props.onCopyClipboard}>
              </TimelineItem>
            )
          });
        });

        return (
          <div className="col-md-12">
            <ul className="timeline">
              {timelineInfo}
              <li>
                <i className="fa fa-clock-o bg-gray"></i>
              </li>
            </ul>
          </div>

        )
      }
    });

    return Timeline;
  }
)