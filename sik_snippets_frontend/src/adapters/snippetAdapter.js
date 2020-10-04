class SnippetAdapter {
  constructor(userId) {
    this.userId = userId
  }

  async getSnippets(categoryId) {
    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${categoryId}/snippets`)
      .then(result => result.json())
      .catch(error => error.message)
  }

  async createSnippet(title, snippet_category_id, body = "") {
    const snippetData = {
      title: title,
      body: body,
      snippet_category_id: snippet_category_id
    }

    const configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(snippetData)
    }

    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${snippet_category_id}/snippets`, configObject)
      .then(result => result.json())
      .catch(error => error.message)
  }

  async saveSnippetContent(snippetTitle, snippetContent, categoryId, snippetId, userId) {
    const data = {
      title: snippetTitle,
      body: snippetContent,
      snippet_category_id: categoryId
    }

    const configObject = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data)
    }

    return fetch(`${app.baseUrl}users/${userId}/snippet_categories/${categoryId}/snippets/${snippetId}`, configObject)
      .then(result => result.json())
      .catch(error => error.message)
  }

  async getSnippetBody(snippetId, snippetCategoryId) {
    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${snippetCategoryId}/snippets/${snippetId}`)
      .then(result => result.json())
      .catch(error => error.message)
  }
}
