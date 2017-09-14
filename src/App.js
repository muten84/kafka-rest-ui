// @flow
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import { ic_list } from 'react-icons-kit/md/ic_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// $FlowIgnore
import 'react-tabs/style/react-tabs.css';


import { created } from './ducks/consumers';
import { mounted } from './ducks/topics';

import type { Consumers, Topics } from './types';
import logo from './logo.svg';
import './App.css';

type Props = {
  created: void,
  mounted: void,
  topics: Topics,
  consumers: Consumers,
};


const colorTheme = {
  scheme: 'google',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',
};

class App extends Component<Props> {
  componentDidMount() {
    if (this.props.mounted) {
      this.props.mounted();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.consumers.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with consumer occurred',
        message: newProps.consumers.error,
        level: 'error',
      });
    }
    if (newProps.topics.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with topic occurred',
        message: newProps.topics.error,
        level: 'error',
      });
    }
  }

  refs: any;
  notificationSystem: NotificationSystem;

  render() {
    return (
      <div className="App">
        <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <span style={{ 'font-size': '1.5em' }}>Kafka Rest UI</span>
        </div>
        <div className="FullHeight">
          <div className="SideNav">
            <SideNav
              highlightBgColor="#6e8294"
              defaultSelected="topics"
              onItemSelection={this.props.created}
            >
              {this.props.topics.list.map((topic, index) =>
                (<Nav id={topic} key={`topic${index}`}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>{topic}</NavText>
                </Nav>))
              }
              {this.props.topics.list.length === 0 && (
                <Nav key={'__notopic'}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>No topic found</NavText>
                </Nav>)
              }
            </SideNav>
          </div>
          <Tabs style={{ height: '-webkit-calc(100% - 42px)' }}>
            <TabList>
              <Tab>Messages</Tab>
              <Tab>Messages (another view)</Tab>
              <Tab>Partitions</Tab>
              <Tab>Configs</Tab>
            </TabList>

            <TabPanel style={{ height: '100%' }}>
              {this.props.consumers.loading && <div className="Progress">
                <Icon className="load" icon={ic_loop} />
                {this.props.consumers.progress}
              </div> }
              {!this.props.consumers.loading && this.props.consumers.records.length > 0 &&
              <div className="Messages">
                <ReactJson
                  src={this.props.consumers.records}
                  name={null}
                  displayDataTypes={false}
                  iconStyle={'circle'}
                />
              </div>}
              {!this.props.consumers.loading && this.props.consumers.records.length === 0 && (<div className="NoContent">No records</div>)}
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              {this.props.consumers.loading && <div className="Progress">
                <Icon className="load" icon={ic_loop} />
                {this.props.consumers.progress}
              </div> }
              {!this.props.consumers.loading && this.props.consumers.records.length > 0 &&
              <div className="Messages">
                <JSONTree
                  data={this.props.consumers.records}
                  theme={colorTheme}
                  hideRoot={false}
                  shouldExpandNode={() => true}
                />
              </div>}
              {!this.props.consumers.loading && this.props.consumers.records.length === 0 && (<div className="NoContent">No records</div>)}
            </TabPanel>
            <TabPanel>
              <h2>Partiotions</h2>
            </TabPanel>
            <TabPanel>
              <h2>Configs</h2>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ consumers, topics }) => ({ consumers, topics });

const mapDispatchToProps = { created, mounted };

export default connect(mapStateToProps, mapDispatchToProps)(App);
