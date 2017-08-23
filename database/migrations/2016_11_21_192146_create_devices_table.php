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
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->double('cost', 11, 3)->nullable();
            $table->double('price', 11, 3)->nullable();
            $table->integer('speed')->nullable();
            $table->string('paper_size')->nullable();
            $table->string('color_or_mono')->nullable();
            $table->string('device_type')->nullable();
			$table->double('maintenance_cost', 8, 4)->nullable();
            $table->double('maintenance_price', 8, 4)->nullable();
            $table->double('cost_per_color_page', 8, 4)->nullable();
            $table->double('cost_per_mono_page', 8, 4)->nullable();
            $table->double('rebates', 8, 4)->nullable();
            $table->string('image')->nullable();
            $table->string('pdf')->nullable();
            $table->string('ced')->nullable();
            $table->string('video')->nullable();
            $table->string('created_by', 20);
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