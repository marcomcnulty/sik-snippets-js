class User {
  constructor(userId, firstName, email, isLoggedIn = true) {
    this.userId = userId
    this.firstName = firstName
    this.email = email
    this.isLoggedIn = isLoggedIn
    this.renderUserProfile()
    this.categoryAdapter = new SnippetCategoryAdapter(userId)
    this.snippetAdapter = new SnippetAdapter(userId)
    this.fetchAndLoadSnippetCategories()
    this.snippetCategories = []
    this.snippets = []
    this.initAndBindEventListeners()
  }

  /* -------------------------------------------------- */
  /* INITIALISATION - DOM */
  /* -------------------------------------------------- */

  renderUserProfile() {
    const viewContainer = document.querySelector('.Container')
    const landingView = document.querySelector('.Info')
    landingView.classList.add('Hide')
    const activeViewHtml = `
      <div class="Profile">
        <div class="Sidebar">
          <i class="fas fa-book fa-3x Sidebar-book Button"></i>
        </div>
        <div class="CategoryColumn Column Hide">
          <div class="CategoryColumn-columnHeader ColumnHeader">
            <input type="text" class="CategoryColumn-categoryInput ColumnInput" placeholder="Add Category">
            <i class="far fa-plus-square fa-3x Add AddCategory Button"></i>
          </div>
          <ul class="CategoryColumn-categoryList List"></ul>
        </div>
        <div class="SnippetColumn Column Hide">
          <div class="SnippetColumn-columnHeader ColumnHeader">
            <input type="text" class="SnippetColumn-snippetInput ColumnInput" placeholder="Add Snippet" disabled>
            <i class="far fa-plus-square fa-3x Add AddSnippet Button"></i>
          </div>
          <ul class="SnippetColumn-snippetList List"></ul>
        </div>
        <div class="EditorColumn">
          <h2 class="EditorColumn-header"></h2>
          <div class="EditorColumn-Editor">
            <textarea class="EditorColumn-editorArea" disabled></textarea>
            <button type="submit" class="EditorColumn-save Button Primary">Save</button>
          </div>
        </div>
      </div>
    `

    viewContainer.insertAdjacentHTML('afterbegin', activeViewHtml)
  }

  /* -------------------------------------------------- */
  /* INITIALISATION - DATA */
  /* -------------------------------------------------- */

  fetchAndLoadSnippetCategories() {
    this.categoryAdapter.getSnippetCategories()
      .then(snippetCategoriesData => {
        const obj = snippetCategoriesData.data.object
        if (obj.length > 0) {
          obj.forEach(snippetCategory => {
            const {
              id,
              title,
              owner
            } = snippetCategory
            this.snippetCategories.push(new SnippetCategory(id, title, owner))
          })
        }
      })
      .catch(error => console.log(error.message))
  }

  // fetchAndLoadSnippets() {
  //   const adapter = new SnippetAdapter(snippetCategoryId, this.userId)
  //   adapter.getSnippets()
  //     .then(snippetsData => {
  //       const obj = snippetsData.data.object
  //       if (obj.length > 0) {
  //         obj.forEach(snippet => {
  //           const {
  //             id,
  //             title,
  //             body,
  //             snippet_category_id
  //           } = snippet
  //           new Snippet(id, title, body, snippet_category_id)
  //         })
  //       }
  //     })
  //     .catch(error => console.log(error.message))
  // }

  /* -------------------------------------------------- */
  /* EVENT LISTENERS */
  /* -------------------------------------------------- */

  initAndBindEventListeners() {
    const addButtons = document.querySelectorAll('.Add')
    const lists = document.querySelectorAll('.List')
    const snippetList = document.querySelector('.SnippetColumn-snippetList')
    const snippetSave = document.querySelector('.EditorColumn-save')


    // const addButton = document.querySelector('.AddCategory')

    const accountButton = document.querySelector('.AccountButton')
    const snippetBook = document.querySelector('.Sidebar-book')
    const inputs = document.querySelectorAll('.ColumnInput')

    accountButton.classList.remove('Hide')

    // addButton.addEventListener('click', e => this.addSnippetCategory(e))


    snippetBook.addEventListener('click', () => {
      this.toggleColumnDisplay()
      this.clearEditor()
    })

    accountButton.addEventListener('click', () => {
      this.logUserOut()
      accountButton.classList.add('Hide')
    })

    inputs.forEach(input => {
      input.addEventListener('click', e => {
        if (e.target.className.includes('Category')) {
          this.removeAllSelections("Category", e)
          this.clearList(snippetList)

        } else {
          this.removeAllSelections("Snippet")
        }

        this.clearEditor()
      })
    })

    addButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.target.className.includes('Category')) {
          this.addSnippetCategory(e)
        } else {
          this.addSnippet(e)
        }
      })
    })

    lists.forEach(list => {
      list.addEventListener('click', e => {
        const selection = e.target.parentNode

        // if a category title is clicked
        if (e.target.className.includes('CategoryListItemTitle')) {
          // check if there is a previous selection in snippet list
          this.removeAllSelections("Snippet")
          // if selection is same as previous selection
          if (selection.className.includes('Selected')) {
            // deselect selection
            this.removeAllSelections("Category")
            this.clearList(snippetList)
          } else {
            this.processSelected("category", e)
            this.clearList(snippetList)
            this.fetchAndLoadSnippets(e)
          }
          this.toggleColumnDisplay("category")
          this.clearEditor()
        } else if (e.target.className.includes('SnippetListItemTitle')) {
          // if selection is same as previous selection
          if (selection.className.includes('Selected')) {
            this.removeAllSelections("Snippet")
          } else {
            this.processSelected("snippet", e)
            this.renderSnippetBody(e)
          }
        }
      })
    })

    snippetSave.addEventListener('click', (e) => {
      e.preventDefault()
      this.saveSnippetBody()
    })
  }

  /* -------------------------------------------------- */
  /* NEW DATA */
  /* -------------------------------------------------- */

  addSnippetCategory(e) {
    const title = e.target.previousElementSibling.value
    const owner = appState["currentUser"]["userId"]
    this.categoryAdapter.createSnippetCategory(title, owner).then(snippetCategoryData => {
        const {
          id,
          title,
          owner
        } = snippetCategoryData.data.object
        this.snippetCategories.push(new SnippetCategory(id, title, owner))
      })
      .catch(error => error.message)
    e.target.previousElementSibling.value = ""
  }


  fetchAndLoadSnippets(e) {
    this.clearEditor()
    const categoryId = e.target.parentNode.id.split('-')[1]

    this.snippetAdapter.getSnippets(categoryId).then(snippetsData => {
        if (snippetsData) {
          const obj = snippetsData.data.object
          if (obj.length > 0) {
            obj.forEach(snippet => {
              const {
                id,
                title,
                body,
                snippet_category_id
              } = snippet
              this.snippets.push(new Snippet(id, title, body, snippet_category_id))
            })
          }
        }
      })
      .catch(error => console.log(error.message))
  }

  addSnippet(e) {
    const title = e.target.previousElementSibling.value
    const categoryId = appState["selectedCategory"]["categoryId"]

    this.snippetAdapter.createSnippet(title, categoryId).then(snippetData => {
        const {
          id,
          title,
          body,
          snippet_category_id
        } = snippetData.data.object
        this.snippets.push(new Snippet(id, title, body, snippet_category_id))
      })
      .catch(error => error.message)

    e.target.previousElementSibling.value = ""
  }

  saveSnippetBody() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    const snippetContent = editor.value
    const userId = appState["currentUser"]["userId"]
    const categoryId = appState["selectedCategory"]["categoryId"]
    const snippetId = appState["selectedSnippet"]["snippetId"]
    const snippetTitle = appState["selectedSnippet"]["snippetTitle"]

    this.snippetAdapter.saveSnippetContent(snippetTitle, snippetContent, categoryId, snippetId, userId).then(json => {
      json.message === "SUCCESS" ? alert("Saved!") : alert("Error!")
    })
  }

  /* -------------------------------------------------- */
  /* DOM MANIPULATION */
  /* -------------------------------------------------- */

  // removes any Selected class from lists
  removeAllSelections(item, e) {
    let list

    if (item === "Category") {
      list = document.querySelector('.SnippetColumn-snippetList').childNodes
      // check for and remove associated snippet selection
      if (list.length > 0) {
        for (const item of list) {
          if (item.className.includes('Selected')) {
            item.classList.remove('Selected')
          }
        }
      }

      list = document.querySelector('.CategoryColumn-categoryList').childNodes
      // remove category selection
      for (const item of list) {
        if (item.className.includes('Selected')) {
          item.classList.remove('Selected')
        }
      }
      // remove selected snippet object from appState
      appState["selectedSnippet"] = {}
      appState["selectedCategory"] = {}
    } else {
      // find and remove the selected item in snippet list only
      list = document.querySelector('.SnippetColumn-snippetList').childNodes

      for (const item of list) {
        if (item.className.includes('Selected')) {
          item.classList.remove('Selected')
        }
      }
      // remove selectrd snippet object from appState
      appState["selectedSnippet"] = {}
    }
  }

  toggleColumnDisplay(element = "snippetBook") {
    const categoryColumn = document.querySelector('.CategoryColumn')
    const snippetColumn = document.querySelector('.SnippetColumn')

    if (element === "snippetBook") {
      this.clearEditor()
      if (appState["isCategoryColumnVisible"] === true) {
        categoryColumn.classList.toggle('Hide')

        if (appState["isSnippetColumnVisible"] === true) {
          snippetColumn.classList.toggle('Hide')
          this.clearEditor()
        }
        appState["isSnippetColumnVisible"] = false
        appState["isCategoryColumnVisible"] = false
        appState["selectedSnippet"] = {}
        appState["selectedCategory"] = {}
        this.removeAllSelections("Category")
      } else {
        categoryColumn.classList.toggle('Hide')
        appState["isCategoryColumnVisible"] = true
      }
    }

    if (element === "category" && appState["isSnippetColumnVisible"] === false) {
      snippetColumn.classList.remove('Hide')
      appState["isSnippetColumnVisible"] = true
    }
  }

  // display select class to highlight user selection
  processSelected(item, e) {
    // initialise variables
    let id = e.target.parentNode.id.split("-")[1]
    let element, obj, keyId, keyName, list
    const fn = this.setInputStatus

    // assign values for selection checker
    if (item === "category") {
      element = document.getElementById(`sc-${id}`)
      obj = "selectedCategory"
      keyId = "categoryId"
      keyName = "categoryTitle";
      list = document.querySelector('.CategoryColumn-categoryList')
    } else if (item === "snippet") {
      element = document.getElementById(`s-${id}`)
      obj = "selectedSnippet"
      keyId = "snippetId"
      keyName = "snippetTitle";
      list = document.querySelector('.SnippetColumn-snippetList')
    }

    this.checkAndDisplaySelection(id, element, obj, keyId, keyName, list, fn, e)
  }

  checkAndDisplaySelection(id, element, obj, keyId, keyName, list, fn, e) {
    // check if selection exists
    if (Object.keys(appState[obj]).length > 0) {
      // check if selection is the same
      if (appState[obj][keyId] === id) {
        // selection exists and is the same
        element.classList.toggle('Selected')
        appState[obj] = {}
        fn(keyName)
      } else {
        // selection exists and is not the same
        const previousSelection = list.querySelector('.Selected')
        previousSelection.classList.remove('Selected')
        element.classList.add('Selected')
        appState[obj][keyId] = id
        appState[obj][keyName] = e.target.parentNode.textContent
        fn(keyName, "enable")
      }
    } else {
      // selection does not exist
      element.classList.add('Selected')
      appState[obj][keyId] = id
      appState[obj][keyName] = e.target.parentNode.textContent
      fn(keyName, "enable")
    }
    console.log(appState)
  }

  setInputStatus(keyName, status = "disabled") {
    let input

    if (keyName === "categoryTitle") {
      input = document.querySelector('.SnippetColumn-snippetInput')
    } else {
      input = document.querySelector('.EditorColumn-editorArea')
    }
    if (status === "enable") {
      input.removeAttribute("disabled")
    } else {
      input.setAttribute("disabled", "")
    }
  }

  clearList(element) {
    while (element.firstChild) {
      element.firstChild.remove()
    }
  }

  clearEditor() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    editor.value = ""
  }

  /* -------------------------------------------------- */
  /* SAVING NEW CATEGORIES */
  /* -------------------------------------------------- */

  renderSnippetBody(e, id) {
    let snippetId

    if (e === "") {
      snippetId = id
    } else {
      snippetId = e.target.parentNode.id.split('-')[1]
    }

    const snippetCategoryId = appState["selectedCategory"]["categoryId"]
    const editor = document.querySelector('.EditorColumn-editorArea')

    this.snippetAdapter.getSnippetBody(snippetId, snippetCategoryId).then(snippetData => {
      const body = snippetData.data.object.body
      editor.value = body
    })
  }

  /* -------------------------------------------------- */
  /* LOG USER OUT, DESTROY SESSION, RESET APP STATE */
  /* -------------------------------------------------- */

  logUserOut = () => {
    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }

    fetch(`${baseUrl}logout`, configObject, {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(json => handleSession(json))
      .catch(error => console.log(error.message))

    appState = {
      ...app.state
    }
  }
}

// marco@gmail.com
