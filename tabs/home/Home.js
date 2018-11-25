import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Button, Alert, TextInput, TouchableHighlight, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';
import { StackNavigator } from 'react-navigation';
import BarCodeScanner from './BarCodeScanner';
import { getInitialInfoAsyn } from '../services/FetchInitialData'
import renderIf from '../services/RenderIf'
import { AddNewVisit, AddNewTransaction, PatchNewVisit } from '../services/AddNew'
import SegmentedControlTab from 'react-native-segmented-control-tab'

class HomeView extends Component {
  constructor(props) {
    super(props);
    getInitialInfoAsyn.call(this);
  }
  static navigationOptions = {
    header: null
  };
  state = {
    visitId: null,
    productDic: {},
    customerDic: {},
    productCatIndex: null,
    postDic: {},
    barCode: '',
    initialInfo: {},
    customers: ['null'],
    customer: null,
    product1: null,
    product2: null,
    product3: null,
    p1Num: null,
    p2Num: null,
    p3Num: null,
    products: ['null'],
    post: null,
    posts: ['null'],
    shops: ['null'],
    shopDic: {},
    shop: null,
    totalPrice: null,
    totalCharged: null,
    totalProfit: null,
    isVisitEnabled: false,
    isLoading: false
  }
  baseState = this.state;//copy of the initial state
  BarCoderReturn(code) {
    this.setState({ barCode: code });
  }

  CalculateTotal() {
    let p1ProductPrice = this.state.product1 ? Number(this.state.productDic[this.state.product1]['price']) : 0;
    let p2ProductPrice = this.state.product2 ? Number(this.state.productDic[this.state.product2]['price']) : 0;
    let p3ProductPrice = this.state.product3 ? Number(this.state.productDic[this.state.product3]['price']) : 0;
    let p1ProductCharged = this.state.product1 ? Number(this.state.productDic[this.state.product1]['charged']) : 0;
    let p2ProductCharged = this.state.product2 ? Number(this.state.productDic[this.state.product2]['charged']) : 0;
    let p3ProductCharged = this.state.product3 ? Number(this.state.productDic[this.state.product3]['charged']) : 0;
    let p1ProductProfit = this.state.product1 ? Number(this.state.productDic[this.state.product1]['profit']) : 0;
    let p2ProductProfit = this.state.product2 ? Number(this.state.productDic[this.state.product2]['profit']) : 0;
    let p3ProductProfit = this.state.product3 ? Number(this.state.productDic[this.state.product3]['profit']) : 0;

    let price = (Number(this.state.p1Num)) * p1ProductPrice + (Number(this.state.p2Num)) * p2ProductPrice + (Number(this.state.p3Num)) * p3ProductPrice;
    this.setState({ totalPrice: price.toFixed(2) });
    var charged = (Number(this.state.p1Num)) * p1ProductCharged + (Number(this.state.p2Num)) * p2ProductCharged + (Number(this.state.p3Num)) * p3ProductCharged;
    this.setState({ totalCharged: charged.toFixed(2) });
    var profit = (Number(this.state.p1Num)) * p1ProductProfit + (Number(this.state.p2Num)) * p2ProductProfit + (Number(this.state.p3Num)) * p3ProductProfit;
    this.setState({ totalProfit: profit.toFixed(2) });
  }
  ShouldCalculate() {
    // if (this.state.p1Num != null && this.state.p2Num != null && this.state.product1 != null && this.state.product2 != null) return true;
    // return false;
    if ((this.state.p1Num >= 1 && this.state.product1) || (this.state.p2Num >= 1 && this.state.product2) || (this.state.p3Num >= 1 && this.state.product3)) return true;
    return false;
  }
  ShouldSendAvailable() {
    if (this.ShouldCalculate() && this.state.totalCharged != '0.00' && this.state.visitId && this.state.post && this.state.customer) return true;
    return false
  }
  TimeGenerator(ifFullTimeRequired) {
    var date = new Date();
    var day = date.getDate();       // yields date
    var month = date.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
    var year = date.getFullYear();  // yields year
    var hour = date.getHours() > 10 ? date.getHours() : '0' + date.getHours();     // yields hours 
    var minute = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes(); // yields minutes
    var second = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds(); // yields seconds
    if (ifFullTimeRequired) return year + "/" + month + "/" + day + "T" + hour + ':' + minute + ':' + second;
    return year + "/" + month + "/" + day;
  }
  OnStartVisitClicked() {
    //user needs to select shop first to start visit
    if (!this.state.shop) {
      alert("您需要先选定商店才能开始本次代购!");
      return;
    }
    this.setState({ isLoading: true });
    //show indicator
    var time = this.TimeGenerator(true);
    AddNewVisit.call(this, time, this.state.shopDic[this.state.shop]);// send the shopId
  }
  OnSendBtnClicked() {
    this.setState({ isLoading: true });
    var objToSend = {};
    var productsInfo = {};
    if (this.state.product1 && this.state.p1Num) productsInfo[this.state.productDic[this.state.product1]['id']] = this.state.p1Num;
    if (this.state.product2 && this.state.p2Num) productsInfo[this.state.productDic[this.state.product2]['id']] = this.state.p2Num;
    if (this.state.product3 && this.state.p3Num) productsInfo[this.state.productDic[this.state.product3]['id']] = this.state.p3Num;
    objToSend['ProductsInfo'] = productsInfo;
    objToSend['TransactionTime'] = this.TimeGenerator(false);
    objToSend['Price'] = this.state.totalPrice;
    objToSend['Profit'] = this.state.totalProfit;
    objToSend['Charged'] = this.state.totalCharged;
    objToSend['CustomerId'] = this.state.customerDic[this.state.customer];
    objToSend['VisitId'] = this.state.visitId;
    objToSend['PostId'] = this.state.postDic[this.state.post];
    AddNewTransaction.call(this, objToSend)
  }
  CleanUp(ifFullCleanUp) {
    if (!ifFullCleanUp) {
      for (var o in this.state) {
        if (o == 'visitId' || o == 'barCode' || o == 'shop') continue;
        if (typeof this.state[o] == 'string') this.state[o] = null;
      }
      for (var o in this.refs) {
        this.refs[o].select(-1);
      }
      this.forceUpdate()//for native script to re-render
      alert('this transaction has been recorded, add a new one or end this visit');
    }
    if (ifFullCleanUp) {
      this.setState(this.baseState);
      this.forceUpdate()//for native script to re-render
      alert('congrats on finishing this visit!');
    }

  }
  ResetProducts() {
    //text inoput
    this.setState({ p1Num: null })
    this.setState({ p2Num: null })
    this.setState({ p3Num: null })
    this.setState({ product1: null })
    this.setState({ product2: null })
    this.setState({ product3: null })
    //drop down
    this.refs['dropdown_product1'].select(-1);
    this.refs['dropdown_product2'].select(-1);
    this.refs['dropdown_product3'].select(-1);

    this.ResetEstimation();
  }

  ResetEstimation() {
    this.setState({ totalPrice: null })
    this.setState({ totalCharged: null })
    this.setState({ totalProfit: null })
  }

  OnEndBtnClicked() {
    this.setState({ isLoading: true });
    var time = this.TimeGenerator(true);
    PatchNewVisit.call(this, this.state.visitId, time);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAwareScrollView
        // style={{ backgroundColor: '#4c69a5' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.view}
      // scrollEnabled={false}
      >

        {renderIf(this.state.visitId == null && this.state.initialInfo != null)(
          <Button
            // onPress={() =>this.OnStartTranClicked()}
            onPress={() => {
              Alert.alert(
                'BuyingAgent',
                '您真的要开始代购吗？',
                [
                  { text: '一会再说' },
                  { text: '取消', style: 'cancel' },
                  { text: '确定', onPress: () => this.OnStartVisitClicked() },
                ],
                { cancelable: false }
              )
            }
            }
            title="开始代购"
          />
        )}

        {renderIf(this.state.shop != null)(
          <Text>{this.state.shop}</Text>
        )}
        <ModalDropdown
          ref="dropdown_shops"
          options={this.state.shops}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => this.setState({ shop: value })}
          defaultValue="商店"
        >
        </ModalDropdown>

        {renderIf(this.state.customer != null)(
          <Text>{this.state.customer}</Text>
        )}
        <ModalDropdown
          ref="dropdown_customers"
          options={this.state.customers}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => this.setState({ customer: value })}
          // onSelect = {(index, value) => {this.select(-1)}}
          defaultValue="顾客"
        >
        </ModalDropdown>

        <SegmentedControlTab
          values={['奶粉', '保健品']}
          selectedIndex={this.state.productCatIndex}
          defaultValue='奶粉'
          onTabPress={(index) => {
            this.setState({
              productCatIndex: index,
            });
            this.ResetProducts();
          }
          }
          tabStyle={{ marginBottom: 8 }}
        />

        <View style={styles.row}>
          {renderIf(this.state.p1Num != null)(
            <Text>{this.state.p1Num}</Text>
          )}
          <TextInput
            style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
            underlineColorAndroid='transparent'
            keyboardType='numeric'
            maxLength={1}  //setting limit of input
            onChangeText={(text) => {
              if (!this.state.productCatIndex) {
                if (Number(this.state.p2Num) + Number(text) + Number(this.state.p3Num) > 6) return
              } else {
                if (Number(this.state.p2Num) + Number(text) + Number(this.state.p3Num) > 20) return
              }
              this.setState({ p1Num: text }, function () {
                if (this.ShouldCalculate()) this.CalculateTotal();
              })
            }
            }
            value={this.state.p1Num}
          />
          {renderIf(this.state.product1)(
            <Text>{this.state.product1}</Text>
          )}
        </View>
        <View style={styles.row}>
          {renderIf(this.state.p2Num)(
            <Text>{this.state.p2Num}</Text>
          )}
          <TextInput
            style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
            underlineColorAndroid='transparent'
            keyboardType='numeric'
            maxLength={1}  //setting limit of input
            onChangeText={(text) => {
              if (!this.state.productCatIndex) {
                if (Number(this.state.p1Num) + Number(text) + Number(this.state.p3Num) > 6) return
              } else {
                if (Number(this.state.p1Num) + Number(text) + Number(this.state.p3Num) > 20) return
              }
              this.setState({ p2Num: text }, function () {
                if (this.ShouldCalculate()) this.CalculateTotal();

              });
            }
            }
            value={this.state.p2Num}
          />
          {renderIf(this.state.product2)(
            <Text>{this.state.product2}</Text>
          )}
        </View>

        <View style={styles.row}>
          {renderIf(this.state.p3Num)(
            <Text>{this.state.p3Num}</Text>
          )}
          <TextInput
            style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
          underlineColorAndroid='transparent'
          keyboardType='numeric'
            maxLength={1}  //setting limit of input
          onChangeText={(text) => {
            if (!this.state.productCatIndex) {
              if (Number(this.state.p1Num) + Number(text) + Number(this.state.p2Num) > 6) return
            } else {
              if (Number(this.state.p1Num) + Number(text) + Number(this.state.p2Num) > 20) return
            }
            this.setState({ p3Num: text }, function () {
              if (this.ShouldCalculate()) this.CalculateTotal();
            });
          }
          }
          value={this.state.p3Num}
          />
          {renderIf(this.state.product3)(
            <Text>{this.state.product3}</Text>
          )}
        </View>

        <ModalDropdown
          ref="dropdown_product1"
          options={this.state.products}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => {
            this.setState({ product1: value }, function () {
              if (this.ShouldCalculate()) this.CalculateTotal();
            });
          }
          }
          defaultValue="产品"
        >
        </ModalDropdown>
        <ModalDropdown
          ref="dropdown_product2"
          options={this.state.products}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => {
            this.setState({ product2: value }, function () {
              if (this.ShouldCalculate()) this.CalculateTotal();
            });
          }
          }
          defaultValue="产品"
        >
        </ModalDropdown>
        <ModalDropdown
          ref="dropdown_product3"
          options={this.state.products}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => {
            this.setState({ product3: value }, function () {
              if (this.ShouldCalculate()) this.CalculateTotal();
            });
          }
          }
          defaultValue="产品"
        >
        </ModalDropdown>

        {renderIf(this.state.post != null)(
          <Text>{this.state.post}</Text>
        )}
        <ModalDropdown
          ref="dropdown_posts"
          options={this.state.posts}
          textStyle={styles.dropDown}
          dropdownTextStyle={styles.dropDown}
          onSelect={(index, value) => this.setState({ post: value })}
          defaultValue="邮递"
        >
        </ModalDropdown>
        <View style={[styles.column,styles.columnTextBox]}>
          {renderIf(this.state.totalPrice != null)(
            <View style={styles.row}>
              <Text>价钱 :</Text>
              <TextInput
                style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({ totalPrice: text });
                }
                }
                value={this.state.totalPrice}
              />
            </View>
          )}
          {renderIf(this.state.totalCharged != null)(
            <View style={styles.row}>
              <Text>实收:</Text>
              <TextInput
                style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({ totalCharged: text });
                }
                }
                value={this.state.totalCharged}
              />
            </View>
          )}
          {renderIf(this.state.totalProfit != null)(
            <View style={styles.row}>
              <Text>利润 :</Text>
              <TextInput
                style={{ height: 20, width: 50, paddingVertical: 0, borderColor: 'gray', borderWidth: 1 }}
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({ totalProfit: text });
                }
                }
                value={this.state.totalProfit}
              />
            </View>
          )}
        </View>

        {renderIf(this.ShouldSendAvailable())(
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.OnSendBtnClicked()}
          >
            <Text style={styles.btnText}>发送</Text>
          </TouchableHighlight>
        )}

        {renderIf(this.state.isVisitEnabled)(
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.OnEndBtnClicked()}
          >
            <Text style={styles.btnText}>结束</Text>
          </TouchableHighlight>
        )}

        <TouchableHighlight
          style={styles.button}
          onPress={() => navigate('BarCodeScanner', { BarCoderReturn: this.BarCoderReturn.bind(this) })}
        >
          <Text style={styles.btnText}>扫描</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => getInitialInfoAsyn.call(this)}
        >
          <Text style={styles.btnText}>重载</Text>
        </TouchableHighlight>

        {renderIf(this.state.isLoading)(
          <View pointEvents='none' style={styles.indicator}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
     </KeyboardAwareScrollView>
    );
  }
}
// export default HomeView
const HomeRouters = StackNavigator({
  Home: { screen: HomeView },
  BarCodeScanner: { screen: BarCodeScanner },
});

export default class App extends React.Component {
  render() {
    return <HomeRouters />;
  }
}

const styles = StyleSheet.create({
  view: {
    // flexDirection: 'row',
    height: 500,
    padding: 20,
  },
  dropDown: {
    margin: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  column: {
    flexDirection: 'column',
  },
  columnTextBox: {
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2a95e9',
    padding: 10,
    marginBottom: 8
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F5FCFF88',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
















