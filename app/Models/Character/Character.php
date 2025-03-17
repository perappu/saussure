<?php

namespace App\Models\Character;

use App\Models\Gallery\Gallery;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Character extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'hash', 'has_image', 'extension', 'designer_url', 'designer_name'];
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'characters';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get the post that owns the comment.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(CharacterFolder::class);
    }

    /**
     * Get the post that owns the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    /**
     * Get the galleries for the character
     */
    public function galleries(): HasMany
    {
        return $this->hasMany(Gallery::class);
    }

}
