class CreateSnippets < ActiveRecord::Migration[6.0]
  def change
    create_table :snippets do |t|
      t.string :title
      t.text :body
      t.references :snippet_category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
