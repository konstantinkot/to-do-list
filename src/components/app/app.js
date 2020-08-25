import React, { Component } from 'react';

import AppHeader from '../app-header';
import TodoList from '../todo-list';
import SearchPanel from '../search-panel';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';
import $ from "jquery";

import './app.css';


export default class App extends Component {

  constructor(props){
      super(props);

      this.state = {
        id: 0,
        items: [],
        filter: 'all',
        search: ''
      };
  }

    componentDidMount(){
        this.getTodoItems();
    }
    
    async getTodoItems(){
        let todoItems = [];
        let z;
        await $.getJSON('./api/todo-items.json', function(data) {
            for(let i = 0; i<data.length; i++){
                todoItems.push(data[i]);
                z = i;
            }
           
        });
        z++;
        await this.setState({
            id: z,
            items: todoItems
        });
        console.log('this.state.items:');
        console.log(this.state.items);
         console.log('this.state.id:');
        console.log(this.state.id);
    }
    
    
  async onItemAdded (label) {
    await this.setState((state) => {
      const item = this.createItem(label);
      return { items: [...state.items, item] };
    });
       let items = JSON.stringify(this.state.items, null, 2);

        console.log(this.state.items);
        
        await $.ajax({
            url: './api/saveItem.php',
            method: 'POST',
            async: false,
            data: {
                text: label,
                items: items
            }
        });
  };

  toggleProperty (arr, id, propName) {
    const idx = arr.findIndex((item) => item.id === id);
    const oldItem = arr[idx];
    const value = !oldItem[propName];

    const item = { ...arr[idx], [propName]: value } ;
    return [
      ...arr.slice(0, idx),
      item,
      ...arr.slice(idx + 1)
    ];
  };

  async onToggleDone (id) {
    await this.setState((state) => {
      const items = this.toggleProperty(state.items, id, 'done');
      return { items };
    });
       let items = JSON.stringify(this.state.items, null, 2);

        console.log(this.state.items);
        
        await $.ajax({
            url: './api/deleteItem.php',
            method: 'POST',
            async: false,
            data: {
                items: items
            }
        });
  };

  async onToggleImportant (id) {
    await this.setState((state) => {
      const items = this.toggleProperty(state.items, id, 'important');
      return { items };
    });
       let items = JSON.stringify(this.state.items, null, 2);

        console.log(this.state.items);
        
        await $.ajax({
            url: './api/deleteItem.php',
            method: 'POST',
            async: false,
            data: {
                items: items
            }
        });
  };

  async onDelete (id) {
    await this.setState((state) => {
      const idx = state.items.findIndex((item) => item.id === id);
      const items = [
        ...state.items.slice(0, idx),
        ...state.items.slice(idx + 1)
      ];
      return { items };
    });
       let items = JSON.stringify(this.state.items, null, 2);

        console.log(this.state.items);
        
        await $.ajax({
            url: './api/deleteItem.php',
            method: 'POST',
            async: false,
            data: {
                items: items
            }
        });
  };

  onFilterChange (filter) {
    this.setState({ filter });
  };

  onSearchChange (search) {
    this.setState({ search });
  };

  createItem(label) {
      
    return {
      id: ++this.state.id,
      label,
      important: false,
      done: false
    };
  }

  filterItems(items, filter) {
    if (filter === 'all') {
      return items;
    } else if (filter === 'active') {
      return items.filter((item) => (!item.done));
    } else if (filter === 'done') {
      return items.filter((item) => item.done);
    }
  }

  searchItems(items, search) {
    if (search.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  render() {
    const { items, filter, search } = this.state;
    const doneCount = items.filter((item) => item.done).length;
    const toDoCount = items.length - doneCount;
    const visibleItems = this.searchItems(this.filterItems(items, filter), search);

    return (
      <div className="todo-app">
        <AppHeader toDo={toDoCount} done={doneCount}/>

        <div className="search-panel d-flex">
          <SearchPanel
            onSearchChange={this.onSearchChange.bind(this)}/>

          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange.bind(this)} />
        </div>

        <TodoList
          items={ visibleItems }
          onToggleImportant={this.onToggleImportant.bind(this)}
          onToggleDone={this.onToggleDone.bind(this)}
          onDelete={this.onDelete.bind(this)} />

        <ItemAddForm
          onItemAdded={this.onItemAdded.bind(this)} />
      </div>
    );
  };
}
