define(
  [
    'react',
    './event-history-item'
  ],
  function (React, EventHistoryItem) {
    var EventHistory = React.createClass({
      getDefaultProps: function () {
        return {
          items: []
        }
      },
      render: function () {
        var items = [];

        if (this.props.items) {
          items = this.props.items.map(function (item) {
            return (
              <EventHistoryItem label={item.label}
                                date={item.date}/>
            )
          });
        }

        return (
          <div>
            <div className="box box-widget">
              <div className="box-footer box-events">
                {items}
              </div>
            </div>
          </div>
        )

      }
    });

    return EventHistory;
  }
)