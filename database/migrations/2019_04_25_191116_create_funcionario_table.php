<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFuncionarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wtg_funcionario', function (Blueprint $table) {
            $table->integer('funcionario_id')
                ->nullable(false)
                ->autoIncrement();
            $table->string('fun_nome', 255);
            $table->decimal('fun_salario', 10,2);
            $table->dateTime('fun_data_nascimento');
            $table->dateTime('fun_data_contratacao');
            $table->integer('cargo_id');
            $table->integer('setor_id');
            $table->foreign('cargo_id')
                ->references('cargo_id')->on('wtg_cargo')
                ->onDelete('cascade');
            $table->foreign('setor_id')
                ->references('setor_id')->on('wtg_setor')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wtg_funcionario');
    }
}
