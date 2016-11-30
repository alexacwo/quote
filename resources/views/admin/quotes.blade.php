@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
	
					<div class="panel-body">
						<form action="{{url('/admin/create-quote')}}" method="POST">
							
							{{ csrf_field() }}
							<button type="submit" class="btn btn-warning">Prepare a new quote</button>
		
						</form>
						<br>
						@if (count($quotes) > 0)
							<div class="panel panel-default">
								<div class="panel-heading">
									Quotes
								</div>
								
								<div class="panel-body">
									<table class="table table-striped task-table">
	
										<thead>
											<th>Id</th>
											<th>Status</th>
											<th>User email</th>
											<th>Link</th>
										</thead>
	
										<tbody>
											@foreach ($quotes as $quote)
												<tr>
													<td class="table-text">
														<div>{{ $quote->id }}</div>
													</td>
													<td class="table-text">
														<div>{{ $quote->status }}</div>
													</td>
													<td class="table-text">
														@if (($quote->user != null))
															<div>{{ $quote->user->email  }}</div>
														@endif
													</td>
													<td class="table-text">
														<a href="{{url('/admin/quote', $quote->guid )}}">
															Edit quote
														</a>
														@if ($quote->status != 'draft')
															/
															<a href="{{url('/quote', $quote->guid )}}">
																Client view
															</a>
														@endif
													</td>
												</tr>
											@endforeach
										</tbody>
									</table>
								</div>
							</div>
						@endif
					</div>
                </div>
            </div>
        </div>
    </div>
@endsection
