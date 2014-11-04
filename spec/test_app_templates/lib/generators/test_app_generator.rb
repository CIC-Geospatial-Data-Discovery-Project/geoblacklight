require 'rails/generators'

class TestAppGenerator < Rails::Generators::Base
  source_root "./spec/test_app_templates"

  def add_gems
    gem 'blacklight', "~> 5.7.1"
    Bundler.with_clean_env do
      run "bundle install"
    end
  end

  def run_blacklight_generator
    say_status("warning", "GENERATING BL", :yellow)

    generate 'blacklight:install', '--devise'
  end

  def install_engine
    generate 'geoblacklight:install'
  end

end
