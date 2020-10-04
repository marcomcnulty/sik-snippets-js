class SnippetCategory {
  constructor(id, title, ownerId) {
    this.id = id
    this.title = title
    this.ownerId = ownerId
    this.user = appState["currentUser"]
    this.snippets = []
    this.renderCategoryList()
    this.initAndBindEventListeners()
  }

  /* -------------------------------------------------- */
  /* INITIALISATION - DOM */
  /* -------------------------------------------------- */

  renderCategoryList() {
    const snippetCategoryList = document.querySelector('.CategoryColumn-categoryList')

    const snippetCategoryListItem = document.createElement('li')
    snippetCategoryListItem.classList.add('ListItem')
    snippetCategoryListItem.id = `sc-${this.id}`

    const listItemTitle = document.createElement('p')
    listItemTitle.classList.add('CategoryListItemTitle')

    const listItemTitleText = document.createTextNode(`${this.title}`)
    listItemTitle.appendChild(listItemTitleText)
    snippetCategoryListItem.appendChild(listItemTitle)

    const deleteIcon = document.createElement('i')
    deleteIcon.id = `${this.id}`
    deleteIcon.classList.add('far')
    deleteIcon.classList.add('fa-trash-alt')
    deleteIcon.classList.add('Button')
    deleteIcon.classList.add('CategoryDelete')
    deleteIcon.classList.add('Delete')
    snippetCategoryListItem.appendChild(deleteIcon)
    snippetCategoryList.appendChild(snippetCategoryListItem)

    snippetCategoryListItem.addEventListener('click', () => {
      this.clearEditor()
    })

    deleteIcon.addEventListener('click', e => {
      this.delete(e)
      this.clearEditor()
    })
  }

  /* -------------------------------------------------- */
  /* EVENT LISTENERS */
  /* -------------------------------------------------- */

  initAndBindEventListeners() {
    // const addButton = document.querySelector('.AddSnippet')
    const categoryList = document.querySelector('.CategoryColumn-categoryList')
    this.clearEditor()

  }

  /* -------------------------------------------------- */
  /* DOM MANIPULATION */
  /* -------------------------------------------------- */

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
  /* DELETE SNIPPET CATEGORY, REMOVE IT AND ALL ASSOCIATED
  /* SNIPPETS FROM DOM */
  /* -------------------------------------------------- */

  preserveASnippetCategorySelection() {
    const snippetCategoryList = document.querySelector('.CategoryColumn-categoryList')

    if (snippetCategoryList.childNodes.length > 0) {
      snippetCategoryList.firstChild.classList.add('Selected')
      appState["selectedCategory"]["categoryId"] = snippetCategoryList.firstChild.id.split('-')[1]
    } else {
      appState["selectedCategory"] = {}
    }
    appState["selectedSnippet"] = {}
    this.clearEditor()
  }






  delete(e) {
    const categoryId = e.target.id

    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }

    fetch(`${app.baseUrl}users/${this.owner}/snippet_categories/${categoryId}`, configObject)
      .then(() => {
        const snippetList = document.querySelector('.SnippetColumn-snippetList')
        this.clearList(snippetList)
        e.target.parentElement.remove()
        this.preserveASnippetCategorySelection()
        console.log(appState)
      })
      .catch(error => console.log(error.message))
  }
}
