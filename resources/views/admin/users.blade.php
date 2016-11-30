@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
					
					<div class="panel-body">

						@if (count($users) > 0)
							<div class="panel panel-default">
								<div class="panel-heading">
									Users
								</div>
	
								<div class="panel-body">
									<table class="table table-striped task-table">
	
										<thead>
											<th>User id</th>
											<th>Username</th>
											<th>Company name</th>
											<th>Email</th>
											<th>Quotes prepared</th>
										</thead>
	
										<tbody>
										@foreach ($users as $user)
											<tr>
												<td class="table-text">
													<div>
														{{ $user->id }}
													</div>
												</td>
												<td class="table-text">
													<div>
														{{ $user->name }}
													</div>
												</td>
												<td class="table-text">
													<div>
														{{ $user->company }}
													</div>
												</td>
												<td class="table-text">
													<div>
														{{ $user->email }}
													</div>
												</td>
												<td class="table-text">
													<div>
														@if (count($user->quotes) > 0)
															@foreach ($user->quotes as $quote)
															<strong>#{{ $quote->id }}</strong><a href="{{url('/admin/quote', $quote->guid )}}">
																	Edit quote
																</a> /
																<a href="{{url('/quote', $quote->guid )}}">
																	Client view
																</a>
																<br><br>
															@endforeach
														@endif
													</div>
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
