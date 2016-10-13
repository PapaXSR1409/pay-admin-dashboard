define(
  [
    'lodash',
    'react',
    'react-bootstrap',
    'react-copy-to-clipboard',
    '../../config'
  ],
  function (_, React, {Popover, OverlayTrigger, Button, FormGroup, InputGroup, FormControl}, CopyToClipboard, Config) {
    var InfoAproval = React.createClass({
      getDefaultProps: function () {
        return {
          approved: false,
          approver: '',
          projectName: '',
          tag: ''
        }
      },
      render: function () {
        var icon = this.props.approved ? 'fa-thumbs-o-up' : 'fa-hand-paper-o';
        var color = this.props.approved ? 'bg-green' : 'bg-grey';
        var message = this.props.approved ? 'Approved by ' + this.props.approver : 'Pending approval';

        var approve = '';
        if (!this.props.approved) {
          var approvalCmd = `approve.sh ${this.props.projectName} ${this.props.tag}`;
          var approvalPopover = <Popover id="popover-positioned-left" title="Approval">
            <FormGroup>
              <InputGroup>
                <InputGroup.Button>
                  <CopyToClipboard text={approvalCmd}
                                   onCopy={() => this.props.onCopyClipboard(approvalCmd)}>
                    <Button><i className="fa fa-clipboard"></i> Copy</Button>
                  </CopyToClipboard>
                </InputGroup.Button>
                <FormControl type="text"
                             value={approvalCmd}
                             readonly/>
              </InputGroup>
            </FormGroup>
          </Popover>;

          approve = <OverlayTrigger trigger="click" placement="left" overlay={approvalPopover}>
            <Button bsStyle="primary" block><i className="fa fa-thumbs-o-up"></i> Approve</Button>
          </OverlayTrigger>
        }

        var releaseNote = '';
        if (this.props.releaseNote) {
          var releaseNotePopover = <Popover id="popover-positioned-left" title="Release note">
            {this.props.releaseNote}
          </Popover>

          releaseNote = <OverlayTrigger trigger="click" placement="left" overlay={releaseNotePopover}>
            <Button bsStyle="danger" block><i className="fa fa-exclamation-triangle"></i> Release note</Button>
          </OverlayTrigger>
        }
        var promote = '';
        if (this.props.approved &&
          (this.props.category === 'integration' ||
          this.props.category === 'staging')) {
          var targetEnvironment = this.props.category === 'integration' ? 'staging' : 'production';

          var urlTemplate = _.template(Config.getJenkinsDeployParamBuildUrl());
          var jobName = 'deploy-' + this.props.projectName.replace('pay-', '') + '-' + targetEnvironment;
          var url = urlTemplate({
            jobName: jobName,
            deployTag: this.props.tag
          });

          promote =
            <Button bsStyle="success" block href={url} target="_blank"><i className="fa fa-arrow-circle-right"></i> Promote to {targetEnvironment}</Button>
        }
        return (
          <div>
            <div className={"info-approval " + color}>
              <span className={"info-approval-icon " + color}>
                  <i className={"fa " + icon}></i>
              </span>

              <div className="info-approval-approver">
                <span className="info-approval-text">{message}</span>
              </div>
            </div>
            {approve}
            {releaseNote}
            {promote}
          </div>
        )
      }
    });

    return InfoAproval;
  }
)