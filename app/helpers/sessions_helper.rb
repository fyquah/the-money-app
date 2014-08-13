module SessionsHelper
  # Create a new remember_token for the user every time he signs in 
  def sign_in user
    remember_token = User.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    user.update_attribute(:remember_token , User.digest(remember_token))
    current_user = user
  end

  def sign_out
    remember_token = User.new_remember_token
    cookies.delete :remember_token
    current_user.update_attribute :remember_token , User.digest(remember_token)
    current_user = nil
  end

  def current_user
    remember_token = User.digest(cookies[:remember_token])
    @current_user ||= User.find_by(:remember_token => remember_token)
  end

  def current_user? user
    user == current_user
  end 

  def current_user= args
    @current_user = args
  end

  def signed_in?
    !current_user.nil?
  end

  def admin_privilege?
    current_user.admin?
  end

  def signed_in_users_only
    unless signed_in?
      store_location
      flash[:notice] = "You have to log in to continue"
      redirect_to signin_path
    end
  end

  def admins_only
    unless admin_privilege?
      flash[:error] = "You are not authenticate to visit the page"
      redirect_to root_url
    end
  end

  def redirect_to_or url
    redirect_to(session[:return_to_url] || url)
    session.delete :return_to_url
  end

  def store_location
    session[:return_to_url] = request.url if request.get?
  end
end
