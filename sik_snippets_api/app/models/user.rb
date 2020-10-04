class User < ApplicationRecord
  has_secure_password

  has_many :snippet_categories, foreign_key: :owner

  validates_presence_of :first_name, :email, :password_digest

  validates :email, uniqueness: true
end
