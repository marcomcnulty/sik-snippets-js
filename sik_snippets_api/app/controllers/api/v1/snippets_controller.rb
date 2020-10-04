class Api::V1::SnippetsController < ApplicationController
  # before_action :set_snippet_category
  # before_action :set_snippet_category
  before_action :set_snippet, only: [:show, :update, :destroy]

  def index
    @snippets = Snippet.where(:snippet_category_id => params[:snippet_category_id])
    json_response(object: @snippets)
  end

  def create
    @snippet = Snippet.create!(
      title: params[:title],
      body: params[:body],
      snippet_category_id: params[:snippet_category_id],
    )
    if @snippet
      json_response(object: @snippet, message: "Snippet saved!", status: :created)
    end
  end

  def show
    json_response(object: @snippet)
  end

  def update
    @snippet.update(title: params["title"], body: params["body"], snippet_category_id: params["snippet_category_id"])
    json_response(object: @snippet)
  end

  def destroy
    @snippet.destroy
    head :no_content
  end

  private

  # def set_snippet_category
  #   @snippet_category = SnippetCategory.find(params[:snippet_category_id])
  # end

  def set_snippet
    @snippet = Snippet.find_by!(id: params[:id])
  end

  def snippet_params
    params.permit(:title, :body, :snippet_category_id)
  end
end
