import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List } from 'antd';
// import { getTimeDistance } from '@/utils/utils';


class SecurityView extends Component {
  handleChangePwd = () => {
 
  }

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      actions: [
        <a onClick={this.handleChangePwd}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
