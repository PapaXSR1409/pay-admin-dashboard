define(
    [
        'react',
        'reactDom',   
        './releases-pipeline-page'
    ], 
    function(React, ReactDOM, ReleasesPipelinePage) {
    	ReactDOM.render(<ReleasesPipelinePage />,  document.getElementById('releases-pipeline-container'));
    }
)    