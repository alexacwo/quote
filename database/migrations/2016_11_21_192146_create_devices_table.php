<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->increments('id');
            $table->string('make');
            $table->string('model');
            $table->float('cost', 11, 3);
            $table->float('base', 11, 3);
            $table->integer('speed');
            $table->string('paper_size');
            $table->string('color_or_mono');
            $table->string('device_type');
            $table->float('maintenance', 8, 4);
            $table->float('cost_per_color_page', 8, 4);
            $table->float('cost_per_mono_page', 8, 4);
            $table->float('rebates', 8, 4);
            $table->string('image');
            $table->string('pdf');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('devices', function (Blueprint $table) {
            //
        });
    }
}
