<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    protected $table = 'wtg_funcionario';
    protected $primaryKey = 'funcionario_id';
    public $timestamps = false;
    protected $fillable = [
        'fun_nome',
        'fun_salario',
        'fun_data_nascimento',
        'fun_data_contratacao',
        'cargo_id',
        'setor_id'
    ];

    public function cargo()
    {
        return $this->hasOne('App\Cargo');
    }

    public function setor()
    {
        return $this->hasOne('App\Setor');
    }
}
