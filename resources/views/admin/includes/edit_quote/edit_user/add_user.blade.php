<div class="panel panel-info">
	<div class="panel-heading">
		Add user
	</div>
	
	<div class="panel-body">
		<div class="col-md-6">
			<div class="form-group">
				@if ($quote->user == null)
					@include('admin.includes.edit_quote.edit_user.create_user')
				@else
					@include('admin.includes.edit_quote.edit_user.existing_user')
				@endif
			</div>
		</div>
		<div class="col-md-6">
			<div class="clients_list_container">
				<div id="clients_list">
					@include('admin.includes.edit_quote.edit_user.capsule_list')
				</div>
			</div>
		</div>
	</div>
</div>