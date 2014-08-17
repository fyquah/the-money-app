module SessionsHelper
  # Create a new remember_token for the user every time he signs in 
  def sign_in user
    remember_token = Session.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    user.sessions.build(:remember_token => Session.digest(remember_token))
    user.save
    current_user = user
  end

  def sign_out
    if signed_in?
      current_user.sessions.find_by(:remember_token => Session.digest(cookies[:remember_token])).destroy
      cookies.delete :remember_token
      current_user = nil
    end
  end

  def sign_out_from_other_devices user
    user.sessions.each do |s|
      s.destroy unless s.remember_token == Session.digest(cookies[:remember_token])
    end
  end

  def current_user
    remember_token = (cookies[:remember_token])
    @current_user ||= Session.find_user(remember_token)
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
