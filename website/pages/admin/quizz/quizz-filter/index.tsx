import React from 'react';
import { Input, Row, Col, Dropdown, Menu, Button, Icon } from 'antd';
import _ from 'lodash';
import { QuizzPageState } from '../../../../rematch/store/models/ui/quizz-page/state';

export interface QuizzFilterProps {
  quizzPageModels: QuizzPageState;
}

class QuizzFilter extends React.Component<QuizzFilterProps> {
  constructor(props: Readonly<QuizzFilterProps>) {
    super(props);
    // this._onSearchInputFilter = _.debounce(this._onSearchInputFilter, 500);
  }

  //   _onRoleFilterSelect(clickParams: ClickParam) {
  //     this.props.setSelectedRoleFilter(clickParams.key);
  //     this.props.searchChangeEffect({});
  //   }

  _renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key={'all'}>
          <a>All</a>
        </Menu.Item>
        <Menu.Item key={'published'}>
          <a>Published</a>
        </Menu.Item>
        <Menu.Item key={'Draft'}>
          <a>Draft</a>
        </Menu.Item>
        <Menu.Item key={'Removed'}>
          <a>Removed</a>
        </Menu.Item>
      </Menu>
    );
  };
  //   _onSearchInputFilter(searchTerm: string) {
  //     this.props.setSearchTerm(searchTerm);
  //     this.props.searchChangeEffect({
  //       searchTerm,
  //       pageOrientation: this.props.userPage.userListPageOrientation,
  //       sortBy: this.props.userPage.sortBy,
  //       role: this.props.userPage.selectedRoleFilter,
  //       pageIndex: this.props.userPage.userListPageIndex,
  //       pageSize: this.props.userPage.pageSize,
  //     });
  //   }

  render(): JSX.Element {
    return (
      <div style={{ margin: '10px 0' }}>
        <Row>
          <Col span={12}>
            <Input
              style={{ width: '70%' }}
              placeholder="Search name"
              key={'filterQuiz'}
              //   onChange={e => {
              //     this._onSearchInputFilter(e.target.value);
              //   }}
            />
          </Col>
          <Col span={12}>
            <b>State</b>
            <Dropdown overlay={this._renderMenu()}>
              <Button style={{ width: '60%', marginLeft: '10px' }}>
                All
                <Icon style={{ float: 'right', marginTop: '3px' }} type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuizzFilter;
