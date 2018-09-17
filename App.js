import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import HomeView from './tabs/home/Home'
import ReportView from './tabs/report/Report'
import AddView from './tabs/add/Add'
import DeleteView from './tabs/delete/Delete'


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const HomeRoute = () =>  <HomeView/>
const AddRoute = () =>  <AddView/>
const ReportRoute = () => <ReportView/>;
const DeleteRoute = () => <DeleteView/>;

export default class App extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'home', title: '任务' },
      { key: 'add', title: '添加' },
      { key: 'report', title: '报告' },
      { key: 'delete', title: '删除' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    home: HomeRoute,
    add: AddView,
    report:ReportView,
    delete:DeleteView
  });

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});