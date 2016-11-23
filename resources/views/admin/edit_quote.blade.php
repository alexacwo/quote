@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Edit quote #{{ $quote->id }}
                        </div>

                        <div class="panel-body">
                            <form action="{{url('/admin/save-quote')}}" method="POST">

                                <ul class="nav nav-tabs">
                                    @foreach ($quoted_devices as $quoted_device)
                                        <li class="{{ ($loop->first) ? 'active' : '' }}">
                                            <a data-toggle="tab" href="#device_{{ $quoted_device->id }}">
                                                {{ $quoted_device->model }}
                                            </a>
                                        </li>
                                    @endforeach
                                </ul>

                                <div class="tab-content">
                                    @foreach ($quoted_devices as $quoted_device)
                                        <div id="device_{{ $quoted_device->id }}" class="tab-pane fade {{ ($loop->first) ? 'in active' : '' }}">
                                            <br><br>Do we need to include these parameters in the description?
                                            <br><input type="checkbox"
                                                       name="devices_desc[{{ $quoted_device->id }}][speed]"
                                                       value="{{$quoted_device->speed}}" />
                                            Speed: {{$quoted_device->speed}}
                                            <br><input type="checkbox"
                                                       name="devices_desc[{{ $quoted_device->id }}][paper_size]"
                                                       value="{{$quoted_device->paper_size}}" />
                                            Paper size: {{$quoted_device->paper_size}}
                                            <br><input type="checkbox"
                                                       name="devices_desc[{{ $quoted_device->id }}][color_or_mono]"
                                                       value="{{$quoted_device->color_or_mono}}" />
                                            Color/mono: {{$quoted_device->color_or_mono}}
                                            <br><input type="checkbox"
                                                       name="devices_desc[{{ $quoted_device->id }}][pdf]"
                                                       value="{{$quoted_device->pdf}}" />
                                            <a href="{{$quoted_device->pdf}}">PDF link</a>

                                            <br><br>
                                            Add accessories:
                                            @foreach ($accessories as $accessory)
                                                <br><input type="checkbox"
                                                           name="add_accessories[{{ $quoted_device->id }}][]"
                                                           value="{{ $accessory->id }}" />
                                                <br><b>{{ $accessory->part_number }}:</b>
                                                <br>Description:
                                                <br>{{ $accessory->description }}
                                            @endforeach

                                        </div>
                                    @endforeach
                                </div>

                                <br><br>
                                {{ csrf_field() }}
                                {{ Form::hidden('quote_id', $quote->id ) }}
                                {{ Form::hidden('quote_request_status_action', $quote_request_status_action ) }}
                                <button type="submit" class="btn btn-primary">
                                    @if ($quote_request_status_action == 'to_be_completed')
                                        Publish
                                    @else
                                        Save
                                    @endif
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
