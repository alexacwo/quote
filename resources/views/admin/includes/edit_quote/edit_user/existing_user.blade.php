<select class="form-control" name="user_type" id="user_type">
	<option value="new"
		@if ($quote->user->user_type == 'new')
			selected
		@endif
	>New User</option>
	<option value="capsule"
			@if ($quote->user->user_type == 'capsule')
			selected
			@endif
	>CapsuleCRM User</option>
</select>
<br>
Username:
<input type="text"
	   class="form-control"
	   name="client_username"
	   id="client_username"
	   value="{{ $quote->user->name }}"
/>
<br>
Company name (if specified):
<input type="text"
	   class="form-control"
	   name="client_company_name"
	   id="client_company_name"
	   value="{{ $quote->user->company }}"
/>
<br>
E-mail (if specified):
<input type="text"
	   class="form-control"
	   name="client_email"
	   id="client_email"
	   value="{{ $quote->user->email }}"
/>