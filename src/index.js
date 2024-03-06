import hh from "hyperscript-helpers";
import { times } from "ramda";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, table, th, td, tr, thead, tbody, input, label } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  UPDATE_MODEL: "UPDATE_MODEL",
  UPDATE_RANDOM_NUMBER: "UPDATE_RANDOM_NUMBER",
  ADD_STUFF: "ADD_STUFF",
  // ... ℹ️ additional messages
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    div({ className: "flex " }, [
      label({ for: "input1", type: "text" }, "Meal:"),
      input({ className: "ml-2 shadow-md border", id: "input1"}),
      label({ className:"ml-2", for: "input2" }, "Calories:"),
      input({ className: "ml-2 shadow-md border", id: "input2", type: "text"}),
      button({ className: btnStyle, onclick: () => dispatch({ type: "ADD_STUFF", payload: { meal: document.getElementById("input1").value, calories: document.getElementById("input2").value }}) }, "add"),
    ]),
    table([
      thead([tr({ className: "p-4" }, [th({ className: "p-4" }, "Meal"), th({ className: "p-4" }, "Calories")])]),
      tbody({ id: "tbody" }, model.tItems.map(item => tr([td({ className: "p-2" }, item.meal), td({ className: "p-2" }, item.calories.toString())])))
    ]),
  ]);
}

function addItemToTable(json, tArray) {
  const newTItem = { id: 1, meal: json.meal, calories: json.calories };
  const newTItems = tArray.push(newTItem);
  return newTItems;
}
//function appendListItem(addItemToTable, model)

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.UPDATE_MODEL:
      return { ...model, currentTime: new Date().toLocaleTimeString() };
    case MSGS.UPDATE_RANDOM_NUMBER:
      return { ...model, randomNumber: Math.random() };
    case MSGS.UPDATE_INCREASE_COUNTER:
      return { ...model, counter: model.counter + 1 };
    case MSGS.UPDATE_DECREASE_COUNTER:
      return { ...model, counter: model.counter - 1 };
    case MSGS.ADD_STUFF:
      const newTItem = { id: model.tItems.length + 1, meal: msg.payload.meal, calories: msg.payload.calories };
      return { ...model, tItems: model.tItems.concat(newTItem) };
    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  tItem: {},
  tItems: [],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
