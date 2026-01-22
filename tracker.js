/*
  File: tracker.js
  Project: Ulta Beauty Gratis & Purchase Tracker
  Purpose: Handles adding, editing, deleting, and displaying items in localStorage for a user.
  Author: Zane Mehmeti
  Notes: Fully client-side; uses jQuery for DOM manipulation
*/

// Called when page loads
function pageReady(){
	initializeTracker();  // Initialize tracker for user
}

// jQuery: run pageReady when DOM is ready
$(document).ready(pageReady);

// Get username from URL query parameters
let username = new URLSearchParams(window.location.search).get("username");

// Holds the id of an item being edited
let editId = null;

// Initialize the tracker page
function initializeTracker() {
	if(!username) {
		// If no username, redirect to landing page
		window.location.href = "index.html";
		return;
	}
	
	// If no data exists for this user, create empty array in localStorage
	if(!localStorage.getItem(username)) {
		localStorage.setItem(username, JSON.stringify([]));
	}
	
	// Display welcome message with username
	$("#welcome").text(`User: ${username}`);
	
	// Set click handler for Add/Update button
	$("#addItemBtn").click(handleAddOrUpdate);
	
	// Render existing items
	renderItems();
}

// Retrieve items for current user from localStorage
function getItems() {
	return JSON.parse(localStorage.getItem(username));
}

// Save items for current user to localStorage
function saveItems(items) {
	localStorage.setItem(username, JSON.stringify(items));
}

// Handle adding a new item or updating an existing one
function handleAddOrUpdate(event) {
	event.preventDefault();
	
	const name = $("#itemName").val();
	const category = $("#category").val();
	const type = $("#type").val();
	
	if(!name) {
		alert("Enter a product name");
		return;
	}
	
	let items = getItems();
	
	if(editId !== null) {
		// Update existing item
		for(let i = 0; i<items.length; i++){
			if(items[i].id === editId) {
				items[i].name = name;
				items[i].category = category;
				items[i].type = type;
				break;
			}		
		}
		editId = null;
		$("#addItemBtn").text("Add Item"); // Reset button text
	
	} 
	else {
	    // Add new item
		items.push({
			id: Date.now(),   					  // Unique ID
			name: name,
			category: category,
			type: type,
			date: new Date().toLocaleDateString() // Save date added
		});
	}
 	
 	// Save updated items and reset form
	saveItems(items);
	clearForm();
	renderItems();
}

// Display all items on the page
function renderItems() {
	$("#items").empty();
	
	const items = getItems();
	console.log("Items:", items); // Debug log
	
	for(let i = 0; i<items.length; i++) {
		 $("#items").append(`
            <div class="item">
                <strong>${items[i].name}</strong><br>
                ${items[i].category} | ${items[i].type} | ${items[i].date}<br>
                <button onclick="editItem(${items[i].id})">Edit</button>
                <button onclick="deleteItem(${items[i].id})">Delete</button>
            </div>
        `);
	}
}

// Load item data into form for editing
function editItem(id) {
	const items = getItems();
	
	for(let i=0; i<items.length; i++){
		if(items[i].id === id) {
			$("#itemName").val(items[i].name);
            $("#category").val(items[i].category);
            $("#type").val(items[i].type);
            editId = id;
            $("#addItemBtn").text("Update Item"); // Change button text
            break;
		}
	
	}

}

// Delete item by id
function deleteItem(id) {
    let items = getItems();
    items = items.filter(item => item.id !== id); // Remove the item
    saveItems(items);
    renderItems();
}

// Clear form inputs
function clearForm() {
    $("#itemName").val("");
    editId = null;
}