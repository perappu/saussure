<?php

namespace App\Models\Character;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CharacterFolder extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'hash', 'description', 'has_image'];
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'character_folders';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get the comments for the blog post.
     */
    public function characters(): HasMany
    {
        return $this->hasMany(Character::class);
    }
}
