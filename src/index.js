import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';
        
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

class Granary extends React.Component {
    constructor(props) {
        super(props);
        axios.get('http://localhost:3000/granary')
        .then((response) => {this.setState({foodItems:response.data})});

        this.state = {
            foodItems: [],
            foodItemsDummy: [
                {
                    name: "steamed ham", 
                    namePlural: "steamed hams",
                    quantity:0,
                    wanted:true,
                    perishable:true,
                },    
                {
                    name: "tomato", 
                    namePlural: "tomatoes",
                    quantity:0,
                    wanted:true,
                    perishable:true,
                }, 
                {
                    name: "radish", 
                    namePlural: "radishes",
                    quantity:1,
                    wanted:false,
                    perishable:true,
                },
                {
                    name: "potato", 
                    namePlural: "potatoes",
                    quantity:1,
                    wanted:false,
                    perishable:false,
                } 
            ],
            // foodItems: axios.get('http://localhost:3000/granary').data,
            text: "",

        };
        
    }

    handleClick() {
        console.log('Success!');
        console.log(this.state.text);
        axios.get('http://localhost:3000/granary')
    .then((response) => {this.setState({foodItems:response.data}); console.log(this.state.foodItems);});

    }

    updateFoodItemData = (foodItem) => {
        console.log("Sending this data: ")
        console.log(foodItem);
        axios.put(`http://localhost:3000/granary/${foodItem.name}`, {name: foodItem.name, quantity: foodItem.quantity, wanted: foodItem.wanted, perishable: foodItem.perishable})
        .then(
            resp => this.setState({foodItems:resp.data})
        );
    }
    
    addToWishList = name => {
        const data = [...this.state.foodItems]; 
        let index = data.findIndex(d => d.name === name);
        if (index !== -1) {
            data[index].quantity = 0;
            data[index].wanted = true;
            this.updateFoodItemData(data[index]);
            // this.setState({foodItems: data});
            
        } else {
            // data.push({name: name, quantity: 0, wanted: true, perishable:true,});
            this.updateFoodItemData({name: name, quantity: 0, wanted: true, perishable:true,});
            // this.setState({foodItems: data});
        }
    }
  
    addToPantry = name => {
        const data = [...this.state.foodItems];
        let index = data.findIndex(d => d.name === name);
        if (index !== -1) {
            data[index].quantity = data[index].quantity+1;
            data[index].wanted = false;
            this.updateFoodItemData(data[index]);
            // this.setState({foodItems: data});
            // console.log(this.state.foodItems);
        } else {
            // data.push({name: name, quantity: 1, wanted: false, perishable:true,});
            this.updateFoodItemData({name: name, quantity: 1, wanted: false, perishable:true,});
            // this.setState({foodItems: data});
        }
        
    }


    removeFromAllList = name => {
        const data = [...this.state.foodItems];
        let index = data.findIndex(d => d.name === name);
        if (index !== -1) {
            data[index].quantity = 0;
            data[index].wanted = false;
            this.updateFoodItemData(data[index]); 
            // this.setState({foodItems: data});
        } else {
            console.log("removeFromAllList ERROR");
        }
        
   
    }

    togglePerishable = name => {
        const data = [...this.state.foodItems];
        let index = data.findIndex(d => d.name === name);
        if (index !== -1) {
            data[index].perishable = !data[index].perishable;
            this.updateFoodItemData(data[index])
            // this.setState({foodItems: data});
        } else {
            console.log("togglePerishable ERROR");
        }
    }

    render() {
        return (
            <div className="border-basic">
                <h1>Granary App</h1>
                <div className='button__container'>
                    <button className='button' onClick={() => this.handleClick()} >Click Me</button>
                </div>
                <div className="row-box">
                    <WishList value={this.state.foodItems} move={this.addToPantry} delete={this.removeFromAllList} add={this.addToWishList} /> 
                    <div className="col-box">
                        <Pantry value={this.state.foodItems} move={this.addToWishList} delete={this.removeFromAllList} perishable={this.togglePerishable} add={this.addToPantry}/>
                        <DeepFreeze value={this.state.foodItems} move={this.addToWishList} delete={this.removeFromAllList} perishable={this.togglePerishable} />
                    </div>
                </div>
            </div>
        );
  	}
}  

class Input extends React.Component {
    state = { 
        tagged: false,
        message: '',
        input1: '',
    }

    handleClick(e) {
        // access input values in the state
        this.setState({tagged: true});
        this.props.add(this.state.input1);
        e.preventDefault();
    }

    handleInputChange = (e, name) => {
      this.setState({
       [name]: e.target.value
     })
    }

    render() {                                                
        return (
            <div id="id" >
                <input
                    placeholder="food name (singular)" 
                    type="text"
                    onChange={(e) => this.handleInputChange(e, 'input1')}
                >
                </input>
                <br />
                <button
                    onClick={(e) => this.handleClick(e)}
                >
                    add
                </button>
            </div>    
        )
    }
}

class WishList extends React.Component {
    
    render() {
        
        const wishList = this.props.value.map((d, ind) => {
                                                return d.wanted ?
                                                    <li key={ind}>
                                                        {d.name}
                                                        <button onClick={()=>this.props.move(d.name)}>-></button>
                                                        <button onClick={()=>this.props.delete(d.name)}>X</button>
                                                    </li>
                                                :
                                                    null; 
                                            }); 
        return (

            <div className="border-blue">
                <h5>Wishlist</h5>
                <Input add={this.props.add}/>
                <br />
                <ul>
                    {wishList}
                </ul>
            </div>
        );
    }
}

class Pantry extends React.Component {
    render() {
        const pantryList = this.props.value.map((d, ind) => {
            return !d.wanted && d.quantity>0 && d.perishable ?
            <li key={ind}>
                {d.name}
                <button onClick={()=>this.props.move(d.name)}>-></button>
                <button onClick={()=>this.props.perishable(d.name)}>V</button>
                <button onClick={()=>this.props.delete(d.name)}>X</button>
            </li> 
            :
                null;
        }); 
        return (
            <div className="border-black">
                <h5>Pantry</h5>
                <Input add={this.props.add}/>
                <br />
                <ul>
                    {pantryList}
                </ul>
            </div> 
        );
    }
}

class DeepFreeze extends React.Component {
    render() {
    const deepFreezeList = this.props.value.map((d, ind) => {
                                                                return !d.wanted && d.quantity>0 && !d.perishable ?
                                                                <li key={ind}>
                                                                    {d.name}
                                                                    <button onClick={()=>this.props.move(d.name)}>-></button>
                                                                    <button onClick={()=>this.props.perishable(d.name)}>^</button>
                                                                    <button onClick={()=>this.props.delete(d.name)}>X</button>
                                                                </li>
                                                                :
                                                                    null
                                                });
        return (
            <div className="border-red">
                <h5>Deep Freeze</h5>
                <ul>
                    {deepFreezeList}
                </ul>
            </div>
        );
    }
}





//============================================================
ReactDOM.render(<Granary />, document.getElementById('root'));
