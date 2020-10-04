class Snippet {
  constructor(id, title, body = "", snippet_category_id) {
    this.id = id
    this.title = title
    this.body = body
    this.snippetCategoryId = snippet_category_id
    this.renderSnippetList()
  }

  renderSnippetList() {
    const snippetList = document.querySelector('.SnippetColumn-snippetList')
    const snippetListItem = document.createElement('li')
    snippetListItem.classList.add('ListItem')
    snippetListItem.id = `s-${this.id}`

    const listItemTitle = document.createElement('p')
    listItemTitle.classList.add('SnippetListItemTitle')

    const listItemTitleText = document.createTextNode(`${this.title}`)
    listItemTitle.appendChild(listItemTitleText)
    snippetListItem.appendChild(listItemTitle)

    const deleteIcon = document.createElement('i')
    deleteIcon.id = `${this.id}`
    deleteIcon.classList.add('far')
    deleteIcon.classList.add('fa-trash-alt')
    deleteIcon.classList.add('Button')
    deleteIcon.classList.add('SnippetDelete')
    deleteIcon.classList.add('Delete')

    snippetListItem.appendChild(deleteIcon)
    snippetList.appendChild(snippetListItem)

    snippetList.addEventListener('click', () => {
      this.clearEditor()
    })

    deleteIcon.addEventListener('click', e => {
      this.delete(e)
      this.clearEditor()
    })
  }

  preserveASnippetSelection() {
    const snippetList = document.querySelector('.SnippetColumn-snippetList')

    if (snippetList.childNodes.length > 0) {
      snippetList.firstChild.classList.add('Selected')
      appState["selectedSnippet"]["snippetId"] = snippetList.firstChild.id.split('-')[1]
      appState["currentUser"].renderSnippetBody("", snippetList.firstChild.id.split('-')[1])
    } else {
      appState["selectedSnippet"] = {}
    }
    this.clearEditor()
  }

  clearEditor() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    editor.value = ""
  }

  clearList(element) {
    while (element.firstChild) {
      element.firstChild.remove()
    }
  }

  delete(e) {
    const snippetId = e.target.id

    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }

    const currentUserId = appState["currentUser"]["userId"]

    fetch(`${app.baseUrl}users/${currentUserId}/snippet_categories/${this.snippetCategoryId}/snippets/${snippetId}`, configObject)
      .then(() => {
        e.target.parentElement.remove()
        // maintains a selection in list if possible
        this.preserveASnippetSelection()
        console.log(appState)

      })
      .catch(error => console.log(error.message))
  }
}
