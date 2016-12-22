define (
	[
		'react',
		'react-bootstrap'
	],
	function  (React, {Image}) {
		var TimelineHeader = React.createClass({
			render: function(){
				return (
			        <h3 className="timeline-header">
			        	<a href={this.props.url} target="_blank">{this.props.title}</a> 
								<i>({this.props.author})</i>
						<Image src={this.props.avatar} alt='dev image' width={40} rounded />
			        	{this.props.children}
			        </h3>
				)
			}
		});

		return TimelineHeader
	}
)