import './App.css';
import 'whatwg-fetch'
import {Form,Card,Checkbox, Container,Image,Icon,Divider,Button,Header, Table, Input, SegmentInline, Grid, GridRow, GridColumn} from 'semantic-ui-react';
import React,{Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Chart } from "react-google-charts";

           

class Stock_page extends Component {

  constructor(props){
    super(props);

    this.state = {
      amountEntered:"",
      strategies: "",
      growth: false,
      value: false,
      ethical: false,
      quality: false,
      index: false,
      submit:false,
      data: ""
    }
  }

  getTable = () => {

    let promise = new Promise((resolve,reject) => {

      fetch('http://127.0.0.1:5000/ret_portfol_table?name=' + this.state.strategies +'&amount='+this.state.amountEntered).then(response => {
        resolve(response.json());
      })

    });

    return promise;

  }


  handleInput = (event) => {

    if (! parseFloat(event.target.value)) {

      window.alert('Amount entered is incorrect,please enter again')
      this.setState({[event.target.name]:""})

    }
    else{
      
      this.setState({[event.target.name]: event.target.value})
    }



  }

  toggle = (name) => {

    if (this.state.strategies.split(",").length > 2) {

      window.alert("Max allowed is 2");

      this.setState({
        amountEntered:"",
        strategies: "",
        growth: false,
        value: false,
        ethical: false,
        quality: false,
        index: false,
        submit:false,
        data: ""
      })


    } else {

      if ( ! this.state[[name]]) {

        this.setState((prevState) => ({ [name]: !prevState[[name]], strategies: this.state.strategies + [name] + ","}))
  
      } else {
  
        this.setState((prevState) => ({ [name]: !prevState[[name]] }))
  
      }

    }

  }

  handleReset = () => {

    this.setState({
      amountEntered:"",
      strategies: "",
      growth: false,
      value: false,
      ethical: false,
      quality: false,
      index: false,
      submit:false,
      data: ""
    })    

  }  

  handleSubmit = () => {

    if (this.state.amountEntered < 5000) {

      window.alert("Amount entered is less then 5000");

      this.setState({
        amountEntered:""})

    }
    else if (this.state.strategies === "") {

      window.alert("Please select atleast one strategy");

    }
    else {

    this.getTable().then(
      data => {

        this.setState({data:data})

      }
    )
    }

  }

  render() {
    console.log(this.state)
    var portfolio = [["Date", "Portfolio Value"]];
    if (this.state.data !== ""){

      portfolio = portfolio.concat(this.state.data.final_portfolio)

    }
    console.log(portfolio)
    return (
      <Container fluid>
        <Divider hidden/>
        <Header as='h1' textAlign="center">Stock Suggestion Engine</Header>
        {this.state.data === ""
        
          ? <Container>
            <Divider hidden/>
            <Form>
              <Form.Field inline={true}>

                <label><h3>Amount: </h3></label>
                <Input name="amountEntered" size={'small'} value={this.state.amountEntered} placeholder={'Enter the Amount'} onChange={event  => this.handleInput(event)}/>

              </Form.Field>

          </Form>
        
        {/* <Divider hidden/> */}
        <br/>
        <h3>Select upto two strategies below </h3>
        <Card.Group itemsPerRow = {5}>
          <Card>
            <Image src='growth.png' width={250} height={150}/>
            <Card.Content>
              <Card.Header><Checkbox name='growth' label='Growth Investing' onChange={()=>this.toggle("growth")} checked={this.state.growth}/></Card.Header>
              <Card.Meta>Focusses on Capital Appreciation</Card.Meta>
              <Card.Description/>

                Netflix 30% <br/>
                Apple 40% <br/>
                Amazon 30%

            </Card.Content>
          </Card>

          <Card>
            <Image src='value.png' width={250} height={150}/>
            <Card.Content>
              <Card.Header><Checkbox name='value' label='Value Investing' onChange={()=>this.toggle("value")} checked={this.state.value}/></Card.Header>
              <Card.Meta>Focusses on Value for Money</Card.Meta>
              <Card.Description/>

              Intel Co 10% <br/>
              Procter & Gamble Co 40% <br/>
              Berkshire Hathway 50%

            </Card.Content>
          </Card>        

          <Card>
            <Image src='quality.png' width={250} height={150}/>
            <Card.Content>
              <Card.Header><Checkbox name='quality' label='Quality Investing' onChange={()=>this.toggle("quality")} checked={this.state.quality}/></Card.Header>
              <Card.Meta>Focusses on High Quality Businesses</Card.Meta>
              <Card.Description/>
                ROKU 10% <br/>
                Salesforce.com, inc. 40% <br/>
                Boeing Co 50%
            </Card.Content>
          </Card>

          <Card>
            <Image src='index.png' width={250} height={150}/>
            <Card.Content>
              <Card.Header><Checkbox name='index' label='Index Investing' onChange={()=>this.toggle("index")} checked={this.state.index}/></Card.Header>
              <Card.Meta>Focusses on Matching Market Index</Card.Meta>
              <Card.Description/>

              iShares Dow Jones Index Fund ETF 40% <br/>
              Schwab® S&P 500 Index Fund 35%  <br/>
              iShares Core S&P 500 ETF 25%

            </Card.Content>
          </Card>     

          <Card>
            <Image src='ethical.png' width={250} height={150}/>
            <Card.Content>
              <Card.Header><Checkbox name='ethical' label='Ethical Investing' onChange={()=>this.toggle("ethical")} checked={this.state.ethical}/></Card.Header>
              <Card.Meta>Focusses on Socially responsible</Card.Meta>
              <Card.Description/>

                3M 25% <br/>
                Microsoft 45% <br/>
                Beyond Meat 30%

            </Card.Content>
          </Card>     
        </Card.Group>

        <Divider hidden/>
        <br/>
        <Button primary name='submit' onClick={()=> this.handleSubmit()} floated='right'>Submit</Button>
          </Container>

          :<Container fluid>

          <Grid padded>

            <GridRow textAlign="center">
              <GridColumn>
              <Button primary name='reset' onClick={()=> this.handleReset()} floated='left'>Reset</Button>
              </GridColumn>

              <Divider hidden/>    
              <Divider hidden/>
              <Divider hidden/> 
            </GridRow>

            <GridRow columns={2}>


              <GridColumn width={8} verticalAlign="middle">

                {

                  Object.entries(this.state.data.Stock).map(([strategy, stocks]) => (

                    <div>

                      <h2 textAlign="center">{strategy[0].toUpperCase() + strategy.slice(1,)}</h2>

                      <Table singleLine>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Current price</Table.HeaderCell>
                            <Table.HeaderCell>Allotment</Table.HeaderCell>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
        
                        <Table.Body>

                          {

                            Object.entries(stocks).map(([stkname, values]) => (

                              <Table.Row>
                              <Table.Cell>{stkname}</Table.Cell>
                              <Table.Cell>{values[0]}</Table.Cell>
                              <Table.Cell>{values[1]}</Table.Cell>
                              <Table.Cell>{values[2]}</Table.Cell>
                            </Table.Row>

                            ))

                          }

                            <Table.Row>
                              <Table.Cell></Table.Cell>
                              <Table.Cell></Table.Cell>
                              <Table.Cell>Total</Table.Cell>
                              <Table.Cell>{parseFloat(this.state.data.Total) / Object.keys(this.state.data.Stock).length}</Table.Cell>
                            </Table.Row>
                          
                        </Table.Body>
                      </Table>

                      <Divider hidden />

                    </div>

                  ))

                }

              </GridColumn>

              <GridColumn width={8}>
              <Chart padded
                width={'800px'}
                height={'600px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={portfolio}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'Total Portfolio',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />

              </GridColumn>

            </GridRow>


          </Grid>

        </Container>
        }

      </Container>
    );
  }

}

export default Stock_page;
