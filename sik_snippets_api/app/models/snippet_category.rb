class SnippetCategory < ApplicationRecord
  has_many :snippets, dependent: :destroy

  validates_presence_of :title
end
