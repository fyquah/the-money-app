class TemplatesController < ApplicationController
  def index
    render "/index"
  end

  def template
    render "/templates/#{params[:path]}" , :layout => false
  end
end