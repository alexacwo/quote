<div>
	Dear <b>{{ $sales_rep }}</b>,
	<br>It appears your quote <b>{{ $to_company }}</b> has been rejected and asked to have you improve it.
	Please see the PDF attached for the accessories and config they requested.
	
	@if (count($quote_annotations) > 0)
	<br>Reasons:
	<ul>
		 @foreach ($quote_annotations as $title => $quote_annotation)
			@if ($quote_annotation != false)
				
				@if ($title == 'missing_key_features')
					<li>Copier is missing key features.</li>
				@endif
				
				@if ($title == 'price' && $quote_annotation == 'expensive')
					<li>Copier is too expensive.</li>
				@endif
				
				@if ($title == 'price' && $quote_annotation == 'cheap')
					<li>Copier is too cheap.</li>
				@endif
				
				@if ($title == 'slow_speed')
					<li>Copier is too slow.</li>
				@endif
				
				@if ($title == 'other_concerns_text' && $quote_annotations['other_concerns'] != false)
					<br><b>Other concerns:</b>
					<li>{{ $quote_annotation }}</li>
				@endif
				
			@endif
		@endforeach
	</ul>
	 @endif
	
	<br><br>Cheers,
	<br><b>Perfect Copier Team</b>
</div>