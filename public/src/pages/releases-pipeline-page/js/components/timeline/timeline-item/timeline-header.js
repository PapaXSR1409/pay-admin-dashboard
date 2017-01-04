define(
	[
		'react',
		'react-bootstrap'
	],
	function (React, {Image}) {
		var TimelineHeader = React.createClass({
			render: function () {
				return (
					<h3 className="timeline-header">
						<Image src={this.props.avatar} alt='dev image' width={14} rounded />
						<a href={this.props.url} target="_blank">{this.props.title}</a>
						<i>({this.props.author})</i>
						{this.props.children}
					</h3>
				)
			}
		});

		return TimelineHeader
	}
)