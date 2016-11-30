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
											<div id="accessories_list">
												<div class="scroll_block">
													@foreach ($accessories as $accessory)
														<br><input
																	type="checkbox"
																   name="add_accessories[{{ $quoted_device->id }}][]"
																   value="{{ $accessory->id }}" />
														<b>{{ $accessory->part_number }}:</b>
														<br>Description:
														<br>{{ $accessory->description }}<br>
													@endforeach
												</div>
											</div>

                                        </div>
                                    @endforeach
                                </div>