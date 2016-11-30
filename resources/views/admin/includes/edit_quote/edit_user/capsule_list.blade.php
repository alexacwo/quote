@foreach ($contacts as $contact)
	<div class="capsule_client_block">
		<div class="client_image">
			@if (property_exists($contact, 'pictureURL'))
				<img src=" {{$contact->pictureURL}} " />
			@endif
		</div>
		<div class="client_contacts">
			<h4 id="capsule_username">
				@if (property_exists($contact, 'firstName'))
					{{$contact->firstName}}
				@endif
				@if (property_exists($contact, 'lastName'))
					{{$contact->lastName}}
				@endif
			</h4>
			@if (property_exists($contact, 'organisationName'))
				<span class="contact">Company:</span>
				<span class="contact details" id="capsule_company_name">{{$contact->organisationName}}</span>
				<br>
			@endif
			@if (property_exists($contact, 'contacts')
			   && property_exists($contact->contacts, 'email')
			   && is_object($contact->contacts->email)
			   && property_exists($contact->contacts->email, 'emailAddress'))
				<span class="contact">Email:</span>
				<span class="contact details" id="capsule_email">
										{{ $contact->contacts->email->emailAddress }}
									</span>
			@endif
			<span class="contact details"></span>
		</div>
	</div>
@endforeach