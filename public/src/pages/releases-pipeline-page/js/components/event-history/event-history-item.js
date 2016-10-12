define(
  [
    'react'
  ],
  function (React) {
    var EventHistoryItem = React.createClass({
      getDefaultProps: function () {
        return {
          label: 'sample comment',
          date: '8:03 PM Today'
        }
      },
      render: function () {
        return (
          <div className="box-events-item">
            <div className="comment-text">
              <span className="username">
                  <span className="text-muted pull-right">{this.props.date}</span>
              </span>
              <i className="fa fa-check bg-green"/>
              <span className="box-events-item-label">{this.props.label}</span>
            </div>
          </div>
        )
      }
    });

    return EventHistoryItem;
  }
)