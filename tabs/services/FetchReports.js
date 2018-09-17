export function getTopCustomer() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/topCustomer')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        topCustomer: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getTopProduct() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/topProduct')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        topProduct: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getTopPost() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/topPost')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        topPost: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getTopVisit() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/topVisit')
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson['date'] = responseJson['date'].split(' ')[0];//get the //dd//mm//yy format
      this.setState({ 
        topVisit: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getTransactionsNum() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/transactionsNum')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        transactionsNum: responseJson,
        isLoading:false
       });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getVisitsNum() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/visitsNum')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        visitsNum: responseJson,
        isLoading:false
       });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getAllProfit() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/allProfit')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        allProfit: responseJson,
        isLoading:false
       });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getMonthsProfit() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/monthsProfit')
    .then((response) => response.json())
    .then((responseJson) => {
      var arr = [];
      for (var o in responseJson) {
        var data = responseJson[o];
        arr.push(data);
      }
      this.state.data = arr;
      this.state.barData[0]['values'] = arr;
      this.state.isLoading = false;
      this.forceUpdate()//for native script to re-render
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getFormulaProfit() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/formulaProfit')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        formulaProfit: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
export function getSupplementsProfit() {
  return fetch('http://buyingagentba-9tmjk-env.ap-southeast-2.elasticbeanstalk.com/api/reports/supplementsProfit')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        supplementsProfit: responseJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

