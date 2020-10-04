class CreateSnippetCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :snippet_categories do |t|
      t.string :title
      t.integer :owner

      t.timestamps
    end
  end
end
