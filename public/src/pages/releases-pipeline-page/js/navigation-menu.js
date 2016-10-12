define(
  [
    'react',
    'react-countdown-clock',
    'react-toggle-button'
  ],
  function (React, ReactCountdownClock, ReactToggleButton) {
    var NavigationMenu = React.createClass({
      getInitialState: function () {
        return {
          autoRefresh: false
        }
      },
      render: function () {
        var countDownClock = <span />;

        if (this.state.autoRefresh) {
          countDownClock = <ReactCountdownClock seconds={60}
                                                color="#000"
                                                alpha={0.9}
                                                size={227}
                                                onComplete={this.props.onCountDown}/>;
        }
        return (
          <aside className="main-sidebar">

            <section className="sidebar">

              <div className="user-panel">
                <div className="pull-left image">
                  <img src="dist/img/gov-uk.png" className="img-circle" alt="User Image"/>
                </div>
                <div className="pull-left info">
                  <h3>
                    Releases
                    <small>pipeline</small>
                  </h3>
                </div>
              </div>

              <ul className="sidebar-menu">
                <li className="header">
                  AUTO-REFRESH
                  <span className="pull-right">
                    <ReactToggleButton
                      value={this.state.autoRefresh}
                      onToggle={(value) => this.setState({autoRefresh: !value})} />
                  </span>
                </li>

                <li className="treeview">
                  {countDownClock}
                </li>
              </ul>

            </section>
          </aside>
        )

        var style = {
          display: "block"
        };
      }
    });

    return NavigationMenu
  }
)