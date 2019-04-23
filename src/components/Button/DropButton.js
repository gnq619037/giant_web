import React from 'react';
import { Button, Menu, Dropdown } from 'antd';

function DropButton({ title, overlay, relatedId }) {
  function getOverLay() {
    if (overlay === null || overlay === undefined) {
      return <Menu />;
    }
    return (
      <Menu>
        {
          overlay.map((item, index) => {
            return <Menu.Item key={`${index}`} ><span onClick={item.onClick}>{item.title}</span></Menu.Item>;
          })
        }
      </Menu>
    );
  }

  return (
    <Dropdown overlay={getOverLay()} trigger={['click']} getPopupContainer={() => document.getElementById(relatedId)}>
      <Button style={{ marginLeft: 8 }}>
        {title} <img style={{ marginLeft: 4 }} src="/dropBtn.png" role="presentation" />
      </Button>
    </Dropdown>);
}

export default DropButton;
