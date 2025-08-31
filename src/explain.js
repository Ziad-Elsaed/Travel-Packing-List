import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: true },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  const [items, setItems] = useState(initialItems); // 80
  // const [numItems, setNumItems] = useState(initialItems.length); // 85 (the wrong way)
  // const numItems = items.length; // 85 (make derived variable is the correct way here)
  // acually the above line we pass moved it to the state component for better readability as we have 3 derived states:)

  // 80
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
    // setNumItems(num => num + 1);// 85 (the wrong way: here we should keep these 2 states sync in all below functions too btw + it also cause multiple re-renders)
  }

  // 82
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // 83
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // 87
  function handleClearList() {
    const confirmed = window.confirm(
      "Are You sure you want to delete all items?"
    ); // make user confirm that he wants to clear the list

    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      {/*So, we could create a prop called handleAddItems and then pass it to function with the same name, but it's kind of a convention for it to be like this. So, it then becomes a bit more readable, like onAddItems, call handleAddItems, */}
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItems={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🏝️Far Away 💼🧳</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState(""); // first step
  const [quantity, setQuantity] = useState(1);
  // const [items, setItems] = useState([]); //80- lifted up :)

  // function handleAddItems(item) {
  //   setItems(items => [...items, item])
  // } // 80- lifted up after lifting state bec it is no longer accesed in the form component (gives error btw)

  function handleSubmit(e) {
    e.preventDefault(); // normal js code
    console.log(e.target, e.currentTarget); //? how target is not the button (the answer is at the end of the explanation)

    console.log(e);

    if (!description) return; // guard clause for input empty validation

    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);

    onAddItems(newItem); // 80
    // handleAddItems(newItem) // 80- lifted up

    setDescription(""); // clear inputs to intial states after submit
    setQuantity(1); // clear inputs to intial states after submit
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {" "}
        {/*e.target.value always return a string so we want to change it to a number*/}
        {/* <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option> */}
        {/* {Array.from({ length: 20 }, (_, i) =>
          <option value={i + 1} key={i + 1}>{i + 1}</option>
        )} */}
        {/*the top is my way*/}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>Add</button>
      {/* <button onClick={handleSubmit}>Add</button> */}
    </form>
  );
}

function PackingList({ items, onDeleteItem, onToggleItems, onClearList }) {
  const [sortBy, setSortyBy] = useState("input"); // 86

  let sortedItems; // 86

  if (sortBy === "input") sortedItems = items; // 86

  if (sortBy === "description")
    // 86
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items.toSorted((a, b) => Number(a.packed) - Number(b.packed)); // 86

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItems={onToggleItems}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        {/*86 */}
        <select value={sortBy} onChange={(e) => setSortyBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">
            Sort by description alphabetically
          </option>
          <option value="packed">Sort by packed status</option>
        </select>
        {/*87 */}
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item: { id, quantity, description, packed }, onDeleteItem, onToggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={packed}
        onChange={() => onToggleItems(id)}
      />
      <span style={packed ? { textDecoration: "line-through" } : {}}>
        {quantity} {description}
      </span>
      <button onClick={() => onDeleteItem(id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to you packing list 🚀</em>
      </p>
    );

  const numItems = items.length; // 85 (make derived variable is the correct way here)
  const numPacked = items.filter((items) => items.packed).length; // 85
  const percentage = Math.round((numPacked / numItems) * 100); // 85

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `You got everthing! Ready to go 🚁`
          : `💼You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`}
      </em>
    </footer>
  );
}

// 69 (starting a new project: the "far away" travel list)
// installing create react app and have a quick overview on the project
// and divide it visually into components

// 70 (building the static layuot)
// setting the files and building the 4 main components

// 71 (rendering the items list)
// rendering items in packinglist component based on inital items array and making Item component
// and know that we can make conditional style in the style object too

// 72 (building a form and handling submissions) (learning how to work with forms in react)
// builiding the form and it's children elements in form component and rendering options in select list dynamically

// remember that the whole conversation about the single page application.
// Where I mentioned that in a single page application, like we want to build with React, we usually can submit a form without the page reloading.
// so let's remove this default behavior of html forms by using prevent defualt

// the important part is that we are listening now for the submit event, that happens on the form.
// And that event happens on the form as soon as we click this button, or as soon as we hit enter while we are in this input element.
// And again, that is just some normal behavior of HTML.
// Now we could also not listen to the submit event, and instead listen for on click event on the button.
// So that would also work, but it would only work on the click of the button only. (not work when we click enter on the input field) (? I tried it and it worked:) too when we hit enter) (answer is in questions section on udemy)
// and we don't want that
// so let's instead, listen for the submit event. And by doing so, we are leveraging the power of HTML forms.

// Now the next question is how do we actually get this data from the form into this event handler, right ?
// Well there are multiple ways of doing so.So we could get that data right from the event object.
// so let's console.log(event)
// So here we get this synthetic base event, and we will talk about what this synthetic event is a bit later.
// But you see that here we get the target.So basically the element on which the event was fired.And then there we have, for example,
// the input on which we can see the value as here. (you will not find it if the event is on the button's onClick)

// However in React, we usually don't do this. Instead, we use something called controlled elements (in the next vedio).

// 73 (controlled elements) (fundemental react concept)
// by default these input fields like this input and also this select
// they maintain their own state inside the DOM. So basically inside the HTML element itself.
// Now this makes it hard to read their values and it also leaves this state right here in the DOM which for many reasons is not ideal.
// So in React, we usually like to keep all this state in just one central place.
// So inside the React application and not inside the DOM. And so in order to do that we use a technique called controlled elements.

// And so with this technique it is React who controls and owns the state of these input fields and no longer the DOM.
// So since we want to now keep this data inside the application, what that means is that we need some state, right? Because that form data of course changes over time and we also want to maintain our application in sync with it.

// So in order to implement the controlled elements technique,
// we follow three steps:
// First: we create a piece of state.
// Second: use that state as the value of element we want to control as input field and select list So we basically force the element to always take the value of this state variable.
// third: of course now need to somehow connect the state with the value that we are actually going to type in the input bec without that the input will contain the defualt value of the state and be unchangable and the state will always be the defualt value even if we type something in the input because this value (value of input) is now coming from our state. The DOM is no longer in charge of this value now,(error in console)

// the only thing that we now have to do is to give this the ability to change itself.
// So to basically update the state each time that we change this value here.
// so we want to update that state variable by using onchange handler where we set the state to the current value of the input field

// why onchange handler act as oninput in vanilla js ? (answer is in questions section on udemy)

// explanation for description state:
// each time that we type here, we set the state again.
// So we set it to the string that is currently
// in this input field, which will then re - render this view.
// So this entire form here actually.
// And so then that new state
// of description will get placed there as the value.
// So we always need both the value
// and the onchange here on the input element.

// so we can write anything. And then basically it will get synchronized
// with this state that we have in our application. And so now it is in fact React that owns the state and that is controlling the state.

// And so with this, it is now this component. So basically it's React who is in charge
// of the state and really of the entire element. And so that's the reason why this technique is called controlled element.

// And so that's the beauty of React being in charge of the form
// because now all we have to do is to update the state and then this enables React to automatically keep this state in sync with these form elements.
// So basically that's the whole idea of the controlled elements. It's to allow React to keep our component state in sync with the state of these dumb form elements.

// then we use those values to make new items
// finally, with this we learned how we get now this data out of the form

// so how we can get the data (newItem object we created) from the form into packing list components (next section)
// of course not with props bec they are sibling components (not parent and child)
// So because data can only flow down the tree but not up or sideways.

// 74 (stats vs props) (presentation slides)

// section 7 **********************************************

// 78 (What is thinking in react?) (presentation slides)

// 79 (fundementals of state managment) (presentation slides)

// 80 (thinking about state and lifting state Up)
// analizing the flowchart from the previouse section and found that we need a new state to hold items to add new item to it and we make it

// while set the items state we made
// So, remember that in React, we are not allowed to mutate state. So, we cannot do this.
// (setItems(items) => items.push(item))
// So, we can not simply push the new item into the items array because with that, we would be mutating.
// So, we would be changing this item's array right here. And again, that's really not allowed in React. So, React is all about immutability.
// And so, the solution here is to create a brand new array which contains all the current items, plus, the new one as we did.

// while making items state in form component he said 
// So, we are not using this items variable anywhere in our JSX yet. And the reason for that
// is that actually, we do not need these items in this form component.  The only goal of the form component
// is to add new items to this array, but not to render it.
// Instead, remember that who renders these items is actually the packing list component.

// as data cannot be passed upward or sideways and we cannot use props too bec they are not parent and Child.
// so to do that we will use the lift up state technique to pass data between two siblings

// So, this is how we lift up state.
// So, basically what that means is that whenever multiple sibling components
// need access to the same state, we move that piece of state up
// to the first common parent component, which again, in our case here, was the app component.

// finally analyze the flow chart and found that we truly needed to lift the state up

// 81 (reveiwing lifting up state) (presentation slides)

// 82 (Deleting an Item: More child-to-parent communication!)
// making handledelete item function and pass it to package component then to item component

// 83 (Updating an item: Complex Immutable Data operation)

// while making the check box input he said that:
// So basically we want to also transform this element right here into a controlled element.
// And remember, a controlled element means that the element has the value defined by some state
// and it also has an event handler which listens for the change and updates the state accordingly.

// jonas made a mistake and use value in the vedio instead of checked
// https://www.udemy.com/course/the-ultimate-react-course/learn/lecture/37350642#questions/19908844

// so here to make the value of the checkbox defined by some state is not by using value prop (it will be useless and not work)
// here in checkbox we use checked prop instead of value prop as in input type text we did before

// a question (answer from udemy) ? why any function going to change the items by using setItems will be placed where the state acually live (here the app component) and why we don't pass the setItem method itself in each componenet who needs it ?
// That would work, but it would also put additional logic in the component that doesn't own that piece of state. Let's say we have another component
// that can delete items from the list.In this case, we would also need to pass setItems() as a prop to that component, and it would possibly
// also declare its own handleDeleteItem() function.Instead, we have just one handleDeleteItem() function that should contain the whole logic of deleting an item.
// I think it also describes the code better because when I look at JSX, I can see what this component is capable of doing at first glance

//   < PackingList
// items = { items }
// onDeleteItem = { handleDeleteItem }
// onToggleItem = { handleToggleItem }
// onClearList = { handleClearList }
//   />

// look at that question too (don't understand ????)
// https://www.udemy.com/course/the-ultimate-react-course/learn/lecture/37350642#questions/20497202

// ???? (question from my mind) try to comment or remove the checked prop from the input type checkbox in item componenet
// then try to click on any check box many times
// for example the first one (passport)
// here when we click the onchange event fire and change the state by using handle toggle item function so there will be a rerender app
// but is the rerender happen to all the components in the app or only the componenets which use the state ?
// if all components rerendered the checkbox should have the defualt unchecked value (not happened)
// and if only components which use this state are rerendered and the input type checkbox is not from them so it will still have the previouse checked value from the previous render (happended)
// remember that this test in case we remove the checked prop from the input type checkbox

// 84 (derived state) (presentation slides)

// 85 (claculating statistics as derived state)
// here we need to calculate statistices in the footer and if we think we will find that we can compute this data from the items array(state) itself
// so derives state is perfect for this

// in that vedio we can say we write most of the code in the footer component
// we made the three variables of derived states + use them + make conditonal rendering + make early return statement

// 86 (sorting items)
// adding sorting items feature by three different options in the packing list

// here in the packing list we made div for select list in jsx and make it controlled element by making sortyby state
// then use the state of controlled element concept to sort items

// how do we make sorting ?
// basically we will just create a new items which is then sorted by that criteria.
// so we are not going to manipulate the original items array as That state should stay unchanged.
// Instead, we will now use again, derived state
// because sorting one array can of course be computed based on that initial array.
// so we made sortedItems derived state variable

// new tip from the questions of the vedio
// we can use toSorted method which doesn't overwrite the original array.
// so instead of making copy of item then use sort (which mutate original array)
// we can just use item.toSorted() instead of item.slice.sort()

// 87 (clearing the list)
// here we add the delete button in packing list
// then making the funciton to clear the items state in the app component
// then pass this function to packing list to be used by the button

// 88 (moving components into seperate files)
// making one compoenent per file :)
// we can do that manually by move each component to a new file named with the name of the componenet
// or we can select the component and right click then click on refactor to make vscode make the file and export and import things automatically
// but take in consider that it export and import with named exports which is completely fine but in react we usually use export defualt so we changed them to defualt exports
// then we make components folder and put all files in it :)

// and now the project is finished :)



// from chat gpt 
// why targe and current target gives form 

// n HTML, if you write:
//   <button>Click me</button>
// and don’t specify type, the default is type = "submit"(when the button is inside a < form >).
// That means when you click it:
// The button itself fires a click event.
// But the form also fires a submit event.

// 🔹 In your React code
// You attached your handler to the form’s onSubmit:
// <form onSubmit={handleSubmit}>
//   <button>Add</button>
// </form>
// So the event you’re handling is the submit event, not the button’s click.
//   e.currentTarget = the form(where the listener lives).
//     e.target = the element that dispatched the submit event.
// And in HTML spec: the submit event is dispatched on the form element, not on the button.
// So both become < form > ✅