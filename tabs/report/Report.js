
// import React, { Component } from 'react';
// import { Text, Image, View, StyleSheet, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { BarChart, XAxis } from 'react-native-svg-charts'
import { View,StyleSheet,ScrollView,Text,Button,TouchableHighlight,ActivityIndicator} from 'react-native'
import {getTopCustomer,getTopProduct,getTopVisit,getTopPost,getTransactionsNum, getVisitsNum,getMonthsProfit,getAllProfit,getFormulaProfit,getSupplementsProfit } from '../services/FetchReports'
import renderIf from '../services/RenderIf'


export default class XAxisExample extends React.PureComponent {

   state = {
      topCustomer : {},
      topProduct : {},
      topPost : {},
      topVisit : {},
      allProfit: null,
      transactionsNum: null,
      visitsNum: null,
      data : [],
      barData: [
        {
            values:[],
            positive: {
                fill: 'rgb(134, 65, 244)',
            },
            negative: {
                fill: 'rgba(134, 65, 244, 0.2)',
            },
        },
    ]
   }

    render() {
            return (
               <View>
                  <ScrollView style = {styles.view}>
                  {renderIf(this.state.topCustomer['name'])(
                  <Text style={styles.reportText}>{"名字:" + this.state.topCustomer['name']}{" 利润:" + this.state.topCustomer['profit']}</Text>
                  )}
                
                     <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getTopCustomer.call(this)}
                    } 
                     >
                    <Text style = {styles.btnText}>创收最多顾客</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.topProduct['productName'])(
                  <Text style={styles.reportText}>{"名字:" + this.state.topProduct['productName']}{"利润:" + this.state.topProduct['profit'] + " 18年5月6号以来"}</Text>
                  )}
           
                    <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getTopProduct.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>创收最多产品</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.topPost['postBrand'])(
                  <Text style={styles.reportText}>{"名字:" + this.state.topPost['postBrand']}</Text>
                  )}

                   <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getTopPost.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>使用最多邮递</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.topVisit['date'])(
                    <Text style={styles.reportText}>{"名字:" + this.state.topVisit['shop']}{" 利润:" + this.state.topVisit['profit']}{" 日期:" + this.state.topVisit['date']}{" 耗时:" + this.state.topVisit['timeElapsed']}</Text>
                    )}
                
                   <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getTopVisit.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>利润最多代购</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.transactionsNum)(
                  <Text style={styles.reportText}>{"次数:" + this.state.transactionsNum}</Text>
                  )}
              
                    <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getTransactionsNum.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>交易次数</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.visitsNum)(
                  <Text style={styles.reportText}>{"次数:" + this.state.visitsNum}</Text>
                  )}

                     <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getVisitsNum.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>代购次数</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.allProfit)(
                    <Text style={styles.reportText}>{"全部利润:" + this.state.allProfit}</Text>
                     )}
                  
                      <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getAllProfit.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>全部利润</Text>
                    </TouchableHighlight>

                    {renderIf(this.state.formulaProfit)(
                    <Text style={styles.reportText}>{"利润:" + this.state.formulaProfit}</Text>
                    )}
                    <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      this.setState({ isLoading: true });
                      getFormulaProfit.call(this)}
                    }
                  >
                    <Text style={styles.btnText}>奶粉利润</Text>
                  </TouchableHighlight>

                  {renderIf(this.state.supplementsProfit)(
                    <Text style={styles.reportText}>{"利润:" + this.state.supplementsProfit}</Text>
                  )}
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      this.setState({ isLoading: true });
                      getSupplementsProfit.call(this)}
                    }
                  >
                    <Text style={styles.btnText}>保健品利润</Text>
                  </TouchableHighlight>
                    
                    <TouchableHighlight
                     style={styles.button}
                     onPress={() => {
                      this.setState({ isLoading: true });
                      getMonthsProfit.call(this)}
                    }
                     >
                    <Text style = {styles.btnText}>月利润柱状图</Text>
                    </TouchableHighlight>

                  <View style={ { height: 200 } }>
                 <BarChart
                    style={ { flex: 1 } }
                    data={ this.state.barData }
                />
                <XAxis
                    style={ { paddingVertical: 16 } }
                    values={ this.state.data }
                    formatLabel={ (value, index) => index + 1}//month starts from 1 not 0
                    chartType={ XAxis.Type.BAR }
                    labelStyle={ { color: 'grey' } }
                />
                
                  </View>

                </ScrollView>

                {renderIf(this.state.isLoading)(
                  <View pointEvents='none' style={styles.indicator}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                )}

              </View>
            )
    }
}

const styles = StyleSheet.create ({
    view:{
        margin: 8,
    },
    reportText: {
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
      },
      button: {
        alignItems: 'center',
        backgroundColor: '#2a95e9',
        padding: 10,
        marginBottom:8
      },
      btnText:{
        color: 'white',
        fontWeight: 'bold'
      },
      indicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor:'#F5FCFF88',
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})
