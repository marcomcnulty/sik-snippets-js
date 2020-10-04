if Rails.env.production?
  Rails.application.config.session_store :cookie_store, key: "_sik-snippets", domain: "example.com"
else
  Rails.application.config.session_store :cookie_store, key: "_sik-snippets"
end
